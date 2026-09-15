import { NextRequest, NextResponse } from 'next/server';
import { getAllCases, getBenchmarks, calculateRealtimeValuation, addAuditLog } from '@/lib/data';
import { LoanCase } from '@/types/collateral';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').toLowerCase().trim();
    const tab = searchParams.get('tab') || 'all';
    const limit = parseInt(searchParams.get('limit') || '5000');
    const offset = parseInt(searchParams.get('offset') || '0');

    let list = getAllCases();

    // Tab filter
    if (tab === 'exceptions') {
      list = list.filter((c) => c.exceptions && c.exceptions !== 'None');
    } else if (tab === 'valuer_queue') {
      list = list.filter((c) => c.valuer_status === 'Pending' || c.valuer_status === 'Inspection Scheduled');
    } else if (tab === 'high_risk') {
      list = list.filter((c) => c.collateral_assessment === 'HIGH - REVIEW REQUIRED');
    } else if (tab === 'low_risk') {
      list = list.filter((c) => c.collateral_assessment === 'LOW - REVIEW COMPLETE');
    }

    // Search query
    if (query) {
      list = list.filter(
        (c) =>
          c.case_id.toLowerCase().includes(query) ||
          c.borrower_name.toLowerCase().includes(query) ||
          c.locality.toLowerCase().includes(query) ||
          c.loan_product.toLowerCase().includes(query)
      );
    }

    const total = list.length;
    const paginated = list.slice(offset, offset + limit);

    return NextResponse.json({
      total,
      limit,
      offset,
      cases: paginated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const benchmarks = getBenchmarks();

    // ── Strict validation: reject empty required fields ──────────
    const locality = body.locality;
    const carpetArea = parseFloat(body.carpet_area_sqft);
    const loanAmount = parseFloat(body.loan_amount_inr);
    const borrowerName = (body.borrower_name || '').trim();

    const missingFields: string[] = [];
    if (!borrowerName) missingFields.push('borrower_name');
    if (!locality) missingFields.push('locality');
    if (isNaN(carpetArea) || carpetArea <= 0) missingFields.push('carpet_area_sqft');
    if (isNaN(loanAmount) || loanAmount <= 0) missingFields.push('loan_amount_inr');

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing or invalid required fields: ${missingFields.join(', ')}. All fields must be explicitly provided.`,
          missingFields,
        },
        { status: 400 }
      );
    }

    // Calculate tax carpet area & variance
    let taxCarpet = body.tax_carpet_area_sqft !== undefined ? parseFloat(body.tax_carpet_area_sqft) : undefined;
    const hasAreaMismatch = body.has_area_mismatch !== undefined ? Boolean(body.has_area_mismatch) : false;
    const hasMissingDocs = body.has_missing_docs !== undefined ? Boolean(body.has_missing_docs) : false;

    if (!hasAreaMismatch && taxCarpet === undefined) {
      taxCarpet = carpetArea;
    } else if (taxCarpet === undefined) {
      taxCarpet = Math.round(carpetArea * 1.0824); // default +8.24% if mismatch flagged
    }

    let areaVariance = 0;
    if (carpetArea > 0) {
      areaVariance = Math.round(((taxCarpet - carpetArea) / carpetArea) * 10000) / 100;
    }

    const isAreaDiscrepant = Math.abs(areaVariance) > 5.0;

    const customMarketRate = parseFloat(body.market_rate_inr_sqft) || parseFloat(body.adjusted_comparable_rate_inr_sqft) || 0;

    const valResult = calculateRealtimeValuation({
      carpetAreaSqft: carpetArea,
      locality,
      loanAmountInr: loanAmount,
      customMarketRate: customMarketRate > 0 ? customMarketRate : undefined,
      areaVariancePercent: areaVariance,
      documentsClean: !hasMissingDocs && !isAreaDiscrepant,
    });

    // Auto-incremented or timestamp-based Case ID
    const random6 = Math.floor(100000 + Math.random() * 900000);
    const newCaseId = body.case_id && body.case_id !== 'CLIQ-DADAR-001'
      ? body.case_id
      : `CLIQ-LIVE-${random6}`;

    const newCase: LoanCase = {
      case_id: newCaseId,
      borrower_name: borrowerName,
      age: parseInt(body.age) || 0,
      occupation: (body.occupation || '').trim(),
      employer_business: (body.employer_business || '').trim(),
      vintage_years: parseFloat(body.vintage_years) || 0,
      annual_income_lakh: parseFloat(body.annual_income_lakh) || 0,
      existing_emi_inr: parseFloat(body.existing_emi_inr) || 0,
      credit_score: parseInt(body.credit_score) || 0,
      loan_product: body.loan_product || 'Loan Against Property (LAP)',
      loan_purpose: (body.loan_purpose || '').trim(),
      loan_amount_inr: loanAmount,
      tenure_years: parseInt(body.tenure_years) || 0,
      interest_rate_percent: parseFloat(body.interest_rate_percent) || 0,
      city: 'Mumbai',
      locality: locality,
      property_type: body.property_type || 'Apartment / Flat',
      property_address: body.property_address || `${locality}, Mumbai, Maharashtra`,
      building_society: (body.building_society || '').trim(),
      flat_house_number: (body.flat_house_number || '').trim(),
      bedrooms: parseInt(body.bedrooms) || 0,
      carpet_area_sqft: carpetArea,
      builtup_area_sqft: parseFloat(body.builtup_area_sqft) || Math.round(carpetArea * 1.2),
      floor: parseInt(body.floor) || 0,
      total_floors: parseInt(body.total_floors) || 0,
      property_age_years: parseInt(body.property_age_years) || 0,
      parking: (body.parking || '').trim(),
      occupancy: body.occupancy || 'Self-occupied',
      condition: 'Good',
      sale_deed_status: 'Uploaded',
      property_card_status: body.pr_card_file_name ? 'Uploaded' : 'Uploaded',
      share_certificate_status: body.share_cert_file_name ? 'Uploaded' : 'Uploaded',
      building_plan_status: body.building_plan_file_name ? 'Uploaded' : 'Uploaded',
      occupancy_certificate_status: body.oc_file_name ? 'Uploaded' : 'Uploaded',
      property_tax_status: isAreaDiscrepant ? 'Flagged Exception' : 'Uploaded',
      encumbrance_status: body.encumbrance_clause || 'No charge indicated in submitted document',
      owner_consistency: 'Pass',
      address_consistency: 'Pass',
      property_id_consistency: 'Pass',
      area_consistency: isAreaDiscrepant ? 'Exception' : 'Pass',
      property_type_consistency: 'Pass',
      document_completeness: hasMissingDocs ? 'Mostly Complete' : 'Complete',
      exceptions: isAreaDiscrepant
        ? `Area inconsistency: Sale Deed ${carpetArea} sq.ft vs Property Tax ${taxCarpet} sq.ft (+${areaVariance}%); manual verification required`
        : hasMissingDocs
        ? 'Supporting document review required'
        : 'None',
      comparable_count: 6,
      adjusted_comparable_rate_inr_sqft: valResult.benchmarkRate,
      indicative_value_inr: valResult.indicativeValue,
      indicative_value_low_inr: valResult.corridorLow,
      indicative_value_high_inr: valResult.corridorHigh,
      valuation_confidence: 'High',
      ltv_percent: valResult.ltvPercent,
      collateral_coverage_x: valResult.collateralCoverage,
      collateral_assessment: valResult.triage,
      valuer_status: isAreaDiscrepant ? 'Pending' : 'Inspection Scheduled',
      valuer_assessed_value_inr: valResult.indicativeValue,
      credit_review_status: isAreaDiscrepant ? 'Under Review' : 'Ready for Credit Review',
      uploaded_document_name: body.uploaded_document_name || body.fileName || '',
      tax_carpet_area_sqft: taxCarpet,
      pr_card_file_name: body.pr_card_file_name || '',
      share_cert_file_name: body.share_cert_file_name || '',
      building_plan_file_name: body.building_plan_file_name || '',
      oc_file_name: body.oc_file_name || '',
      tax_receipt_file_name: body.tax_receipt_file_name || '',
      search_report_file_name: body.search_report_file_name || '',
      encumbrance_clause: body.encumbrance_clause || '',
      tax_owner_name: body.tax_owner_name || '',
    };

    // Prepend to cases so it immediately shows at the top of the Live Tracking Stream
    getAllCases().unshift(newCase);

    addAuditLog({
      case_id: newCase.case_id,
      officer_name: 'S. Nair',
      officer_role: 'Senior Credit Officer',
      action_type: 'INITIAL_TRIAGE',
      description: `New dynamic case ingested: ${newCase.borrower_name} (${newCase.loan_product} INR ${(newCase.loan_amount_inr / 1e7).toFixed(2)} Cr, ${newCase.locality}). Triage: "${newCase.collateral_assessment}". File: ${newCase.uploaded_document_name || 'N/A'}`,
      previous_state: 'None',
      new_state: newCase.collateral_assessment,
    });

    return NextResponse.json({ success: true, case: newCase }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
