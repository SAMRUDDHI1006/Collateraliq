import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs, addAuditLog } from '@/lib/data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get('case_id') || undefined;
    const logs = getAuditLogs(caseId);
    return NextResponse.json({ logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newLog = addAuditLog({
      case_id: body.case_id || 'CLIQ-SYSTEM',
      officer_name: body.officer_name || 'S. Nair',
      officer_role: body.officer_role || 'Senior Credit Officer',
      action_type: body.action_type || 'EXCEPTION_ACKNOWLEDGED',
      description: body.description || 'Action performed',
      previous_state: body.previous_state,
      new_state: body.new_state,
    });
    return NextResponse.json({ success: true, log: newLog }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
