import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty body is handled cleanly
    }

    // Artificial slight latency to simulate OCR text extraction
    await new Promise((res) => setTimeout(res, 300));

    const fileName = body.fileName || body.uploaded_document_name || 'Uploaded_Document.pdf';
    const documentType = body.document_type || 'primary_deed';

    // Helper: try to infer borrower name from filename if not explicitly provided
    let derivedName = body.borrower_name || body.borrowerName || '';
    if (!derivedName && fileName) {
      const cleanFile = fileName
        .replace(/\.pdf$/i, '')
        .replace(/^(CLIQ|DOC|AGR|DEED)_/i, '')
        .replace(/_(Sale_Deed|Agreement|Docket|Index2|Deed|Tax|Share|OC|PRCard|Plan|Search)$/i, '')
        .replace(/[-_]/g, ' ');
      if (cleanFile.trim().length > 2) {
        derivedName = cleanFile.trim();
      }
    }
    const borrowerName = (derivedName || 'Uploaded Document Borrower').trim();
    const locality = body.locality || 'Dadar West';
    const carpetArea = parseFloat(body.carpet_area_sqft) || 750;
    const hasAreaMismatch = body.has_area_mismatch !== undefined ? Boolean(body.has_area_mismatch) : false;
    const taxCarpet = body.tax_carpet_area_sqft !== undefined
      ? parseFloat(body.tax_carpet_area_sqft)
      : (hasAreaMismatch ? Math.round(carpetArea * 1.0824) : carpetArea);

    const varianceSqft = taxCarpet - carpetArea;
    const variancePct = carpetArea > 0 ? Math.round((varianceSqft / carpetArea) * 10000) / 100 : 0;
    const unit = body.flat_house_number ? `Flat No. ${body.flat_house_number}` : 'Flat No. 502';
    const building = body.building_society || `${locality} Co-Op Hsg Soc Ltd`;
    const docRandomNum = Math.floor(1000 + Math.random() * 9000);

    // Dynamic Micro-Extractions based on Document Category
    let microExtractions: Record<string, any> = {};

    if (documentType === 'tax_receipt' || fileName.toLowerCase().includes('tax')) {
      microExtractions = {
        tax_carpet_area_sqft: taxCarpet,
        tax_owner_name: borrowerName.toUpperCase(),
        assessment_year: '2025-2026',
        sac_number: `MH-${locality.slice(0, 3).toUpperCase()}-2025-${docRandomNum}`,
        dues_balance: 'NIL - Fully Paid',
        receipt_number: `MCGM-PT-2025-${docRandomNum}`,
        variance_sqft: varianceSqft,
        variance_percentage: variancePct,
        is_mismatched: Math.abs(variancePct) > 5.0,
      };
    } else if (documentType === 'share_certificate' || fileName.toLowerCase().includes('share')) {
      microExtractions = {
        member_name: borrowerName.toUpperCase(),
        flat_number: unit,
        building_society: building,
        certificate_no: `SC-${docRandomNum}`,
        shares_allotted: '10 Shares (Nos. 451 to 460)',
        endorsement_status: 'Clean Member Signature Endorsed',
      };
    } else if (documentType === 'search_report' || fileName.toLowerCase().includes('search')) {
      const encClause = hasAreaMismatch
        ? 'Mortgage registered with State Bank of India in 2014; NOC required'
        : 'Clean Title - No Adverse Charge or Encumbrance Disclosed (30-Year Search Complete)';
      microExtractions = {
        search_period: '30 Years (1995 to 2025)',
        encumbrance_status: hasAreaMismatch ? 'Prior Charge Disclosed' : 'Clean Title / No Adverse Charge',
        encumbrance_clause: encClause,
        title_advocate_opinion: hasAreaMismatch ? 'RFI Required' : 'Marketable & Clear Title',
      };
    } else if (documentType === 'pr_card' || fileName.toLowerCase().includes('card')) {
      microExtractions = {
        cts_number: `CTS No. 412/A, ${locality} Division`,
        holder_name: borrowerName.toUpperCase(),
        land_area_sqm: Math.round(carpetArea * 0.092903 * 1.5),
        revenue_remarks: 'URBAN LAND CEILING (ULC) CLEARANCE VERIFIED',
      };
    } else if (documentType === 'building_plan' || fileName.toLowerCase().includes('plan')) {
      microExtractions = {
        approval_number: `BMC/BP/SANCTION/${docRandomNum}/2021`,
        approving_authority: 'Municipal Corporation of Greater Mumbai (MCGM)',
        layout_match: 'Approved 2 BHK Floor Layout Matches Deeded Specifications',
      };
    } else if (documentType === 'occupancy_certificate' || fileName.toLowerCase().includes('oc')) {
      microExtractions = {
        oc_number: `EB/4012/OC/2022`,
        issuing_authority: 'Municipal Corporation Building Proposal Dept',
        completion_status: 'Full Occupancy Granted Without Conditions',
      };
    }

    return NextResponse.json({
      success: true,
      document_type: documentType,
      file_name: fileName,
      micro_extractions: microExtractions,
      extracted_docket: {
        document_number: `BBE-4-0${docRandomNum}-2024`,
        registration_date: new Date().toLocaleDateString('en-GB'),
        stamp_duty_inr: Math.round(carpetArea * 1500),
        purchaser_name: borrowerName.toUpperCase(),
        instrument_type: 'Registered Agreement for Sale / Index-II Extract',
        source_file_name: fileName,
        asset: {
          unit: unit,
          floor: body.floor || 5,
          total_floors: body.total_floors || 12,
          building_society: building,
          address: `${locality}, Mumbai, Maharashtra`,
          cts_no: `412/A, ${locality} Division`,
          carpet_area_sqft: carpetArea,
          carpet_area_sqm: Math.round(carpetArea * 0.092903 * 100) / 100,
          builtup_area_sqft: Math.round(carpetArea * 1.2),
          unit_configuration: '2 BHK (2 Bed, 2 Bath, 1 Utility Balcony)',
          allocated_parking: body.parking || '1 Covered Stilt Parking Space',
          consideration_value_inr: Math.round(carpetArea * 40000),
        },
        tax_ledger_extract: {
          assessment_year: '2025-2026',
          bill_date: '12/04/2025',
          sac_number: `MH-${locality.slice(0, 3).toUpperCase()}-2025-${docRandomNum}`,
          ward: `${locality} Municipal Assessment Ward`,
          assessed_carpet_area_sqft: taxCarpet,
          dues_balance: 'NIL - Fully Paid',
          payment_method: 'RTGS',
          receipt_number: `MCGM-PT-2025-${docRandomNum}`,
          assessed_capital_value_inr: Math.round(taxCarpet * 40000),
        },
        clauses: [
          {
            clause: 'Clause 4(a)',
            title: 'Premises Conveyance',
            text: `The Vendor hereby agrees to transfer and convey to the Purchaser, ${borrowerName.toUpperCase()}, the residential ${unit} situated at ${building}, having a registered carpet area of ${carpetArea} sq.ft, together with all rights appurtenant thereto.`
          },
          {
            clause: 'Clause 11',
            title: 'Appurtenant Parking',
            text: 'The transfer of the said premises includes the exclusive right to use one allocated parking space, subject to the rules and records of the housing society.'
          },
          {
            clause: 'Clause 18',
            title: 'Free from Encumbrance Warranty',
            text: 'The Vendor warrants, for the purposes of this instrument, that the said premises are free from any undisclosed encumbrance, charge or adverse claim created by the Vendor, subject to the applicable records and statutory searches.'
          }
        ],
        exception_detection: {
          flag: Math.abs(variancePct) > 5.0 ? 'POTENTIAL_AREA_INCONSISTENCY' : 'CLEAN_RECORD',
          sale_deed_sqft: carpetArea,
          tax_bill_sqft: taxCarpet,
          variance_sqft: varianceSqft,
          variance_percentage: variancePct,
          threshold_percentage: 5.0,
          exceeds_threshold: Math.abs(variancePct) > 5.0,
          triage_recommendation: Math.abs(variancePct) > 5.0 ? 'MEDIUM - REVIEW REQUIRED' : 'LOW - REVIEW COMPLETE',
          guidance: Math.abs(variancePct) > 5.0
            ? `Since variance (+${variancePct}%) exceeds the standard 5% tolerance, manual valuer physical measurement is mandated prior to credit sanction.`
            : 'Deed carpet area and municipal ledger match within standard tolerance.'
        }
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
