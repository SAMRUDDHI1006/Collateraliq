import { NextRequest, NextResponse } from 'next/server';
import { getAllCasesWithLive, processNewCase, saveLiveCase } from '@/lib/caseStore';
import { addAuditLog } from '@/lib/data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').toLowerCase().trim();
    let list = getAllCasesWithLive();

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
      caseId: body.caseId,
      borrowerName: body.borrowerName || body.borrower?.fullName || 'New Borrower',
      borrower: body.borrower,
      product: body.product || 'Home Loan',
      loanPurpose: body.loanPurpose,
      loanFacilityRequested: parseFloat(body.loanFacilityRequested) || 0,
      tenureYears: parseInt(body.tenureYears) || 15,
      interestRate: parseFloat(body.interestRate) || 8.5,
      propertyProfile: {
        location: body.location || body.propertyProfile?.location || 'Dadar West',
        propertyType: body.propertyType || body.propertyProfile?.propertyType || 'Apartment',
        bhk: body.bhk || body.propertyProfile?.bhk || '2 BHK',
        carpetArea: parseFloat(body.carpetArea || body.propertyProfile?.carpetArea) || 0,
        builtUpArea: parseFloat(body.builtUpArea || body.propertyProfile?.builtUpArea) || undefined,
        floor: parseInt(body.floor || body.propertyProfile?.floor) || 1,
        totalFloors: parseInt(body.totalFloors || body.propertyProfile?.totalFloors) || undefined,
        buildingAge: parseInt(body.buildingAge || body.propertyProfile?.buildingAge) || 0,
        parking: body.parking || body.propertyProfile?.parking || 'Open Parking',
        occupancy: body.occupancy || body.propertyProfile?.occupancy || 'Self-occupied',
        address: body.address || body.propertyProfile?.address || '',
        pinCode: body.pinCode || body.propertyProfile?.pinCode || '',
      },
      valuerReport: body.valuerAssessedValue || body.valuerReport ? {
        valuerName: body.valuerName || body.valuerReport?.valuerName || 'Empaneled IBBI Valuer',
        assessedValue: parseFloat(body.valuerAssessedValue || body.valuerReport?.assessedValue) || 0,
        inspectionDate: body.valuerInspectionDate || body.valuerReport?.inspectionDate || new Date().toISOString().split('T')[0],
        conditionRating: body.valuerConditionRating || body.valuerReport?.conditionRating || 'Good',
        comparablesUsedCount: parseInt(body.valuerComparablesCount || body.valuerReport?.comparablesUsedCount) || 3,
        adjustmentsNote: body.valuerAdjustmentsNote || body.valuerReport?.adjustmentsNote || undefined,
      } : undefined,
      balanceTransfer: body.isBalanceTransfer || body.balanceTransfer ? {
        isBalanceTransfer: true,
        previousLender: body.previousLender || body.balanceTransfer?.previousLender,
        previousValuation: parseFloat(body.previousValuation || body.balanceTransfer?.previousValuation),
        previousValuationDate: body.previousValuationDate || body.balanceTransfer?.previousValuationDate,
        outstandingBalance: parseFloat(body.outstandingBalance || body.balanceTransfer?.outstandingBalance),
        existingEmi: parseFloat(body.existingEmi || body.balanceTransfer?.existingEmi),
        existingInterestRate: parseFloat(body.existingInterestRate || body.balanceTransfer?.existingInterestRate),
        loanStartDate: body.loanStartDate || body.balanceTransfer?.loanStartDate,
        previousRatePerSqFt: parseFloat(body.previousRatePerSqFt || body.balanceTransfer?.previousRatePerSqFt),
        previousAreaConsidered: parseFloat(body.previousAreaConsidered || body.balanceTransfer?.previousAreaConsidered),
        previousValuationMethod: body.previousValuationMethod || body.balanceTransfer?.previousValuationMethod,
        previousValuerName: body.previousValuerName || body.balanceTransfer?.previousValuerName,
      } : { isBalanceTransfer: false },
    });

    saveLiveCase(newCase);

    addAuditLog({
      case_id: newCase.caseId,
      officer_name: 'Samruddhi Chaudhari',
      officer_role: 'Senior Credit Risk Officer',
      action_type: 'INITIAL_TRIAGE',
      description: `Live fresh case created. Model valuation: INR ${(newCase.modelIndicativeValue / 1e7).toFixed(3)} Cr. Status: ${newCase.reviewLevel} REVIEW.`,
      previous_state: 'Intake',
      new_state: newCase.status,
    });

    return NextResponse.json({ case: newCase }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
