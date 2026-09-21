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
      const pctDiff = Number(((absDiff / item.modelIndicativeValue) * 100).toFixed(1));

      item.deviation = {
        absoluteDiff: absDiff,
        percentageDiff: pctDiff,
        identifiedDrivers: [body.valuer_override_reason || 'Valuer Subjective Calibration'],
        requiresManualReview: pctDiff > 10,
      };

      item.status = pctDiff > 10 ? 'REVIEWED' : 'VALUER_LINKED';

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
