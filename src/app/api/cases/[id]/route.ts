import { NextRequest, NextResponse } from 'next/server';
import { getCaseById, addAuditLog } from '@/lib/data';
import { saveNewCase } from '@/lib/caseStore';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const caseId = params.id;
    const item = getCaseById(caseId);

    if (!item) {
      return NextResponse.json({ error: `Case ${caseId} not found` }, { status: 404 });
    }

    return NextResponse.json({
      case: item,
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

    if (body.valuer_assessed_value_inr) {
      const assessedVal = parseFloat(body.valuer_assessed_value_inr);
      const valuerRate = Math.round(assessedVal / item.propertyProfile.carpetArea);

      item.valuerReport = {
        valuerName: body.valuer_name || item.valuerReport?.valuerName || 'Empaneled Valuer Report',
        assessedValue: assessedVal,
        areaConsidered: item.propertyProfile.carpetArea,
        rateApplied: valuerRate,
        inspectionDate: new Date().toISOString().split('T')[0],
        conditionRating: 'Satisfactory (Grade A)',
        marketability: 'High',
        adjustmentsNote: body.valuer_override_reason || 'Valuer adjustment applied',
      };

      const absDiff = Math.abs(assessedVal - item.modelIndicativeValue);
      const pctDiff = Number(((assessedVal - item.modelIndicativeValue) / item.modelIndicativeValue * 100).toFixed(2));
      const modelRate = Math.round(item.modelIndicativeValue / item.propertyProfile.carpetArea);

      item.deviation = {
        absoluteDiff: absDiff,
        percentageDiff: pctDiff,
        effectiveRate: {
          modelRate,
          valuerRate,
          diffPerSqFt: valuerRate - modelRate,
        },
        comparablesCount: { modelCount: 3, valuerCount: 3 },
        avgComparableRate: { modelAvg: modelRate, valuerAvg: valuerRate },
        areaUsed: { modelArea: item.propertyProfile.carpetArea, valuerArea: item.propertyProfile.carpetArea },
        valuationDate: { modelDate: new Date().toISOString().split('T')[0], valuerDate: new Date().toISOString().split('T')[0] },
        methodology: { modelMethod: 'AI Comparable Model', valuerMethod: 'Sales Comparison Approach' },
        explicitAdjustments: body.valuer_override_reason || 'Valuer adjustment applied',
        explanationConfidence: 'High',
        explanationText: `Valuer assessed value updated to ₹${(assessedVal / 1e7).toFixed(3)} Cr (${pctDiff}% variance).`,
        identifiedDrivers: [body.valuer_override_reason || 'Valuer Subjective Calibration'],
      };

      if (Math.abs(pctDiff) > 8.0) {
        item.reviewLevel = 'HIGH';
      } else if (Math.abs(pctDiff) > 3.0) {
        item.reviewLevel = 'MEDIUM';
      } else {
        item.reviewLevel = 'LOW';
      }

      addAuditLog({
        case_id: item.caseId,
        officer_name: 'P. Deshmukh',
        officer_role: 'Empaneled IBBI Valuer',
        action_type: 'VALUER_OVERRIDE',
        description: `Valuer assessed value updated to INR ${(assessedVal / 1e7).toFixed(3)} Cr. Reason: "${body.valuer_override_reason || 'Calibration'}".`,
        previous_state: 'Indicative Ready',
        new_state: item.status,
      });
    }

    if (body.exception_acknowledged) {
      addAuditLog({
        case_id: item.caseId,
        officer_name: 'S. Nair',
        officer_role: 'Senior Credit Officer',
        action_type: 'EXCEPTION_ACKNOWLEDGED',
        description: 'Valuation reconciliation deviation acknowledged with HITL audit sign-off.',
        previous_state: item.status,
        new_state: 'Sanction Ready',
      });
    }

    saveNewCase(item);
    return NextResponse.json({ case: item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
