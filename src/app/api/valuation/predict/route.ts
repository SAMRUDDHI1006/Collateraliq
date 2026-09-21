import { NextRequest, NextResponse } from 'next/server';
import { calculateRealtimeValuation } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const carpetArea = parseFloat(body.carpetArea || body.carpet_area_sqft);
    const locality = body.locality || body.location || 'Dadar West';
    const loanAmount = parseFloat(body.loanFacilityRequested || body.loan_amount_inr);
    const valuerAssessedValue = body.valuerAssessedValue ? parseFloat(body.valuerAssessedValue) : undefined;

    if (isNaN(carpetArea) || isNaN(loanAmount)) {
      return NextResponse.json(
        { error: 'carpetArea and loanFacilityRequested are required numeric fields.' },
        { status: 400 }
      );
    }

    const result = calculateRealtimeValuation({
      carpetAreaSqft: carpetArea,
      locality,
      loanAmountInr: loanAmount,
      valuerAssessedValue,
    });

    return NextResponse.json({
      success: true,
      calculation: result,
      regulatory: {
        rbi_ceiling_ltv: 75.0,
        rbi_rule_citation: 'RBI Master Direction - Housing Finance Prudential LTV ceiling <= 75%.',
        tolerance_ceiling_pct: 10.0,
        ibbi_rule_citation: 'IBBI Registered Valuers Rules - Valuation deviation threshold set at 10%.',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
