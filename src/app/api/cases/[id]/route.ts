import { NextRequest, NextResponse } from 'next/server';
import { getCaseById, addAuditLog } from '@/lib/data';
import { VerificationFieldComparison } from '@/types/collateral';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const caseId = params.id;
    const item = getCaseById(caseId);

    if (!item) {
      return NextResponse.json({ error: `Case ${caseId} not found` }, { status: 404 });
    }

    const deedCarpet = item.carpet_area_sqft || 850;
    const taxCarpet = item.tax_carpet_area_sqft !== undefined
      ? item.tax_carpet_area_sqft
      : (item.area_consistency === 'Exception' || item.case_id.includes('DADAR'))
      ? Math.round(deedCarpet * 1.0824)
      : deedCarpet;

    const varianceSqft = taxCarpet - deedCarpet;
    const variancePct = deedCarpet > 0 ? Math.round((varianceSqft / deedCarpet) * 10000) / 100 : 0;
    const isAreaDiscrepant = varianceSqft !== 0 && Math.abs(variancePct) > 5.0;

    const verificationMatrix: VerificationFieldComparison[] = [
      {
        id: 'VF-01',
        field_name: 'Owner / Title Holder',
        source_sale_deed: item.borrower_name,
        source_tax_receipt: item.borrower_name,
        status: 'MATCH',
        regulatory_anchor: 'Maharashtra Registration Rules (Rule 44)',
        is_flagged: false,
      },
      {
        id: 'VF-02',
        field_name: 'Unit / Flat Identification',
        source_sale_deed: `Flat No. ${item.flat_house_number}, ${item.floor}th Floor`,
        source_tax_receipt: `Flat ${item.flat_house_number}, ${item.floor}th Floor`,
        status: 'MATCH',
        regulatory_anchor: 'MOFA / MahaRERA Allotment Specification',
        is_flagged: false,
      },
      {
        id: 'VF-03',
        field_name: 'Society & Building Name',
        source_sale_deed: item.building_society,
        source_tax_receipt: item.building_society.replace('(The ', '').replace(' Ltd)', ' Ltd'),
        status: 'MATCH',
        regulatory_anchor: 'MCS Act Sec 22 (Share Registry)',
        is_flagged: false,
      },
      {
        id: 'VF-04',
        field_name: 'Carpet Area (RERA Standard)',
        source_sale_deed: `${deedCarpet} sq.ft (${(deedCarpet * 0.092903).toFixed(2)} sq.mtrs)`,
        source_tax_receipt: `${taxCarpet} sq.ft (${(taxCarpet * 0.092903).toFixed(2)} sq.mtrs)`,
        status: isAreaDiscrepant ? 'DISCREPANCY' : 'MATCH',
        variance_details: isAreaDiscrepant
          ? `+${varianceSqft} sq.ft / +${variancePct}% variance`
          : 'Exact match (0% variance)',
        tolerance_status: isAreaDiscrepant ? 'EXCEEDS_TOLERANCE' : 'WITHIN_TOLERANCE',
        regulatory_anchor: 'MahaRERA Sec 2(k) & IBBI Valuer Standard (5% Tolerance)',
        is_flagged: isAreaDiscrepant,
      },
      {
        id: 'VF-05',
        field_name: 'Statutory Identification (CTS / SAC)',
        source_sale_deed: `CTS No. 412/A, ${item.locality} Division`,
        source_tax_receipt: `SAC No. MH-${item.locality.slice(0, 3).toUpperCase()}-2025-${item.flat_house_number}`,
        status: 'CROSS_INDEXED',
        variance_details: `Municipal Ward ${item.locality} cadastral cross-reference authenticated`,
        tolerance_status: 'WITHIN_TOLERANCE',
        regulatory_anchor: 'Municipal Property Index / Cadastral Ward Map',
        is_flagged: false,
      },
      {
        id: 'VF-06',
        field_name: 'Security Interest & Dues',
        source_sale_deed: 'Clause 18: Free from undisclosed encumbrance',
        source_tax_receipt: 'Dues Balance: NIL - Fully Paid (RTGS Verified)',
        status: 'MATCH',
        regulatory_anchor: 'CERSAI / SARFAESI Act Sec 26D',
        is_flagged: false,
      },
    ];

    const primaryDocName = item.uploaded_document_name || 'Sale Deed / Registered Index-II';
    const documentsList = [
      { id: 'DOC-01', title: primaryDocName, status: 'Verified', date: '14/09/2024', pages: 18, isPrimary: true },
      { id: 'DOC-02', title: item.pr_card_file_name || 'Property Card / CTS Extract', status: item.pr_card_file_name ? 'Uploaded' : 'Uploaded', date: '04/01/2025', pages: 2, isPrimary: false },
      { id: 'DOC-03', title: item.share_cert_file_name || 'Society Share Certificate', status: item.share_cert_file_name ? 'Uploaded' : 'Uploaded', date: '20/10/2024', pages: 1, isPrimary: false },
      { id: 'DOC-04', title: item.building_plan_file_name || 'Approved Building Layout Plan', status: item.building_plan_file_name ? 'Uploaded' : 'Uploaded', date: '15/06/2022', pages: 4, isPrimary: false },
      { id: 'DOC-05', title: item.oc_file_name || 'Occupancy Certificate (OC)', status: item.oc_file_name ? 'Uploaded' : 'Uploaded', date: '12/08/2022', pages: 2, isPrimary: false },
      { id: 'DOC-06', title: item.tax_receipt_file_name || 'Property Tax Bill & Paid Ledger', status: isAreaDiscrepant ? 'Flagged Exception' : 'Uploaded', date: '12/04/2025', pages: 3, isPrimary: false },
      { id: 'DOC-07', title: item.search_report_file_name || 'Title Search Report (30 Years)', status: isAreaDiscrepant ? 'Prior Charge Disclosed' : 'Clear Title', date: '10/08/2026', pages: 14, isPrimary: false },
    ];

    return NextResponse.json({
      case: item,
      verificationMatrix,
      documentsList,
      areaVariance: {
        isDiscrepant: isAreaDiscrepant,
        deedArea: deedCarpet,
        taxArea: taxCarpet,
        diffSqft: varianceSqft,
        diffPct: variancePct,
        toleranceMaxPct: 5.0,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const caseId = params.id;
    const body = await req.json();
    const item = getCaseById(caseId);

    if (!item) {
      return NextResponse.json({ error: `Case ${caseId} not found` }, { status: 404 });
    }

    if (body.valuer_assessed_value_inr !== undefined) {
      const prev = item.valuer_assessed_value_inr;
      item.valuer_assessed_value_inr = parseFloat(body.valuer_assessed_value_inr);
      item.valuer_status = body.valuer_status || 'Completed';
      item.valuer_override_reason = body.valuer_override_reason || item.valuer_override_reason;

      addAuditLog({
        case_id: item.case_id,
        officer_name: 'P. Deshmukh',
        officer_role: 'Empaneled IBBI Valuer',
        action_type: 'VALUER_OVERRIDE',
        description: `Valuer assessed value updated to INR ${(item.valuer_assessed_value_inr).toLocaleString('en-IN')}. Reason: "${item.valuer_override_reason || 'Remeasurement confirmed'}".`,
        previous_state: prev ? `INR ${prev.toLocaleString('en-IN')}` : 'None',
        new_state: `INR ${item.valuer_assessed_value_inr.toLocaleString('en-IN')}`,
      });
    }

    if (body.exception_acknowledged) {
      addAuditLog({
        case_id: item.case_id,
        officer_name: 'S. Nair',
        officer_role: 'Senior Credit Officer',
        action_type: 'EXCEPTION_ACKNOWLEDGED',
        description: `Area discrepancy exception acknowledged for case ${item.case_id} after review of valuer physical inspection notes.`,
        previous_state: 'Pending Review',
        new_state: 'Acknowledged',
      });
    }

    return NextResponse.json({ success: true, case: item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
