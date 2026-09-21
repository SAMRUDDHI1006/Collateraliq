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
      product: body.product || 'Home Loan',
      loanPurpose: body.loanPurpose,
      loanFacilityRequested: parseFloat(body.loanFacilityRequested) || 20000000,
      tenureYears: parseInt(body.tenureYears) || 15,
      interestRate: parseFloat(body.interestRate) || 10.5,
      propertyProfile: {
        location: body.location || body.propertyProfile?.location || 'Dadar West',
        propertyType: body.propertyType || body.propertyProfile?.propertyType || 'Apartment',
        bhk: body.bhk || body.propertyProfile?.bhk || '2 BHK',
        carpetArea: parseFloat(body.carpetArea || body.propertyProfile?.carpetArea) || 850,
        builtUpArea: parseFloat(body.builtUpArea || body.propertyProfile?.builtUpArea) || 1020,
        floor: parseInt(body.floor || body.propertyProfile?.floor) || 5,
        totalFloors: parseInt(body.totalFloors || body.propertyProfile?.totalFloors) || 10,
        buildingAge: parseInt(body.buildingAge || body.propertyProfile?.buildingAge) || 5,
        parking: body.parking || body.propertyProfile?.parking || '1 Covered Space',
        occupancy: body.occupancy || body.propertyProfile?.occupancy || 'Self-occupied',
      },
      valuerReport: body.valuerAssessedValue || body.valuerReport ? {
        valuerName: body.valuerName || body.valuerReport?.valuerName || 'Empaneled Valuer',
        assessedValue: parseFloat(body.valuerAssessedValue || body.valuerReport?.assessedValue) || 20000000,
        inspectionDate: new Date().toISOString().split('T')[0],
      } : undefined,
      balanceTransfer: body.isBalanceTransfer || body.balanceTransfer ? {
        isBalanceTransfer: true,
        previousLender: body.previousLender || body.balanceTransfer?.previousLender,
        previousValuation: parseFloat(body.previousValuation || body.balanceTransfer?.previousValuation),
        outstandingBalance: parseFloat(body.outstandingBalance || body.balanceTransfer?.outstandingBalance),
      } : { isBalanceTransfer: false },
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
