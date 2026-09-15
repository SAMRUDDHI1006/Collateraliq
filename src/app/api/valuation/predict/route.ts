import { NextRequest, NextResponse } from 'next/server';
import { calculateRealtimeValuation } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const carpetArea = parseFloat(body.carpet_area_sqft);
    const locality = body.locality || 'Dadar West';
    const loanAmount = parseFloat(body.loan_amount_inr);
    const areaVariance = parseFloat(body.area_variance_percent ?? 0);
    const encumbranceVerified = body.encumbrance_verified !== undefined ? Boolean(body.encumbrance_verified) : true;

    if (isNaN(carpetArea) || isNaN(loanAmount)) {
      return NextResponse.json(
        { error: 'carpet_area_sqft and loan_amount_inr are required numbers' },
        { status: 400 }
      );
    }

    const result = calculateRealtimeValuation({
      carpetAreaSqft: carpetArea,
      locality,
      loanAmountInr: loanAmount,
      areaVariancePercent: areaVariance,
      encumbranceVerified,
    });

    return NextResponse.json({
      success: true,
      calculation: result,
      regulatory: {
        rbi_ceiling_ltv: 75.0,
        rbi_rule_citation: 'RBI Master Direction - Housing Finance (Prudential LTV ceiling <= 75% for facilities above INR 30 Lakhs).',
        tolerance_ceiling_pct: 5.0,
        ibbi_rule_citation: 'IBBI (Registered Valuers and Valuation) Rules, 2017 - Valuation corridor tolerance limit set at +/- 5%.',
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
