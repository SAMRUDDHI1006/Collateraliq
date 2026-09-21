import { NextRequest, NextResponse } from 'next/server';
import { getStoredCases, processNewCase } from '@/lib/caseStore';
import { addAuditLog } from '@/lib/data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').toLowerCase().trim();
    let list = getStoredCases();

    if (query) {
      list = list.filter(
        (c) =>
          c.caseId.toLowerCase().includes(query) ||
          c.borrowerName.toLowerCase().includes(query) ||
          c.propertyProfile.location.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      total: list.length,
      cases: list,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newCase = processNewCase({
      borrowerName: body.borrowerName || 'New Borrower',
      location: body.location || 'Dadar West',
      propertyType: body.propertyType || 'Residential Apartment',
      bhk: body.bhk || '2 BHK',
      carpetArea: parseFloat(body.carpetArea) || 850,
      builtUpArea: parseFloat(body.builtUpArea) || 1020,
      floor: parseInt(body.floor) || 5,
      buildingAge: parseInt(body.buildingAge) || 5,
      parking: body.parking || '1 Covered Space',
      occupancy: body.occupancy || 'Self-occupied',
      loanFacilityRequested: parseFloat(body.loanFacilityRequested) || 20000000,
      valuerName: body.valuerName,
      valuerAssessedValue: body.valuerAssessedValue ? parseFloat(body.valuerAssessedValue) : undefined,
      valuerRateApplied: body.valuerRateApplied ? parseFloat(body.valuerRateApplied) : undefined,
      isBalanceTransfer: Boolean(body.isBalanceTransfer),
      previousLender: body.previousLender,
      previousValuation: body.previousValuation ? parseFloat(body.previousValuation) : undefined,
      outstandingBalance: body.outstandingBalance ? parseFloat(body.outstandingBalance) : undefined,
    });

    addAuditLog({
      case_id: newCase.caseId,
      officer_name: 'S. Nair',
      officer_role: 'Senior Credit Officer',
      action_type: 'INITIAL_TRIAGE',
      description: `Collateral assessment executed. Model indicative value: INR ${(newCase.modelIndicativeValue / 1e7).toFixed(3)} Cr.`,
      previous_state: 'Unprocessed',
      new_state: newCase.status,
    });

    return NextResponse.json({ case: newCase }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
