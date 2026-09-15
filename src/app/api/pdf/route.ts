import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const pdfPath = path.join(process.cwd(), 'docs', 'CLIQ-DADAR-001_Docket.pdf');
    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json({ error: 'PDF docket not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(pdfPath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="CLIQ-DADAR-001_Docket.pdf"',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
