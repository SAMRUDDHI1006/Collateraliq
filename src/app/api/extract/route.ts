import { NextRequest, NextResponse } from 'next/server';
import { REGIONS_22 } from '@/lib/caseStore';
import { PDFParse } from 'pdf-parse';

interface ExtractedField<T> {
  value: T | null;
  status: 'EXTRACTED' | 'NOT_FOUND';
  source: string;
  note?: string;
}

export async function POST(req: NextRequest) {
  try {
    let rawText = '';
    let fileName = 'Uploaded_Document.pdf';
    let documentCategory = 'property_info'; // 'property_info' | 'valuation_report' | 'balance_transfer'
    let manualInputs: Record<string, any> = {};

    const contentType = req.headers.get('content-type') || '';

    // 1. Process Multipart Form Data (Real PDF File Upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      documentCategory = (formData.get('document_type') as string) || 'property_info';
      const manualInputsStr = formData.get('manual_inputs') as string | null;
      if (manualInputsStr) {
        try {
          manualInputs = JSON.parse(manualInputsStr);
        } catch {}
      }

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No PDF file provided in request.' },
          { status: 400 }
        );
      }

      fileName = file.name || 'Uploaded_Document.pdf';

      if (!fileName.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        return NextResponse.json(
          { success: false, error: 'Uploaded file must be a valid PDF format.' },
          { status: 400 }
        );
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuffer);
        const parser = new PDFParse(uint8);
        const parseResult = await parser.getText();
        rawText = parseResult.text || '';
      } catch (pdfErr: any) {
        console.error('PDF parsing error:', pdfErr);
        return NextResponse.json(
          {
            success: false,
            error: 'Unable to extract information from this PDF. Please upload a readable PDF or enter the information manually.',
            details: pdfErr.message,
          },
          { status: 422 }
        );
      }
    } else {
      // 2. Process JSON Payload (Fallback / testing)
      const body = await req.json().catch(() => ({}));
      documentCategory = body.document_type || 'property_info';
      fileName = body.fileName || body.uploaded_document_name || 'Document.pdf';
      manualInputs = body.manual_inputs || {};
      rawText = body.text || '';

      if (body.base64) {
        try {
          const buffer = Buffer.from(body.base64, 'base64');
          const parser = new PDFParse(new Uint8Array(buffer));
          const parseResult = await parser.getText();
          rawText = parseResult.text || '';
        } catch (err: any) {
          return NextResponse.json(
            { success: false, error: 'Unable to decode and extract text from provided base64 PDF.' },
            { status: 422 }
          );
        }
      }
    }

    if (!rawText || rawText.trim().length < 15) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to extract information from this PDF. The document contains no readable text layer (e.g. image-only scan). Please upload a text-readable PDF or enter the information manually.',
        },
        { status: 422 }
      );
    }

    // Normalised text for extraction
    const cleanText = rawText.replace(/\r/g, ' ').replace(/\t/g, ' ');

    // ─────────────────────────────────────────────────────────────────────────────
    // Helper Parser Functions
    // ─────────────────────────────────────────────────────────────────────────────

    const extractNumber = (patterns: RegExp[]): number | null => {
      for (const pattern of patterns) {
        const match = cleanText.match(pattern);
        if (match && match[1]) {
          const num = parseFloat(match[1].replace(/,/g, '').trim());
          if (!isNaN(num) && num > 0) return num;
        }
      }
      return null;
    };

    const extractString = (patterns: RegExp[]): string | null => {
      for (const pattern of patterns) {
        const match = cleanText.match(pattern);
        if (match && match[1]) {
          const val = match[1].trim();
          if (val.length > 1) return val;
        }
      }
      return null;
    };

    const extractIndianCurrency = (patterns: RegExp[]): number | null => {
      for (const pattern of patterns) {
        const match = cleanText.match(pattern);
        if (match && match[1]) {
          let num = parseFloat(match[1].replace(/,/g, '').trim());
          if (isNaN(num)) continue;
          const unit = (match[2] || '').toLowerCase();
          if (unit.includes('cr')) {
            num = Math.round(num * 1e7);
          } else if (unit.includes('l')) {
            num = Math.round(num * 1e5);
          }
          if (num > 0) return num;
        }
      }
      return null;
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // Category 1: Property Information Document / Deed / Index-II
    // ─────────────────────────────────────────────────────────────────────────────
    if (documentCategory === 'property_info' || documentCategory === 'primary_deed') {
      // 1. Carpet Area
      const carpetArea = extractNumber([
        /(?:carpet\s*area|registered\s*carpet\s*area|carpet\s*measurement|carpet)[\s:=]+([0-9,]+(?:\.[0-9]+)?)\s*(?:sq\.?\s*ft|sqft|square\s*feet|sq\s*mtrs?)/i,
        /([0-9,]+(?:\.[0-9]+)?)\s*(?:sq\.?\s*ft|sqft|square\s*feet)\s*(?:carpet|carpet\s*area)/i,
        /having\s*(?:a\s*)?carpet\s*area\s*of[\s:=]+([0-9,]+(?:\.[0-9]+)?)/i,
        /carpet\s*area\s*of\s*about[\s:=]+([0-9,]+(?:\.[0-9]+)?)/i,
      ]);

      // 2. Built-Up Area
      const builtUpArea = extractNumber([
        /(?:built-?up\s*area|super\s*built-?up\s*area|bua)[\s:=]+([0-9,]+(?:\.[0-9]+)?)\s*(?:sq\.?\s*ft|sqft)/i,
        /([0-9,]+(?:\.[0-9]+)?)\s*(?:sq\.?\s*ft|sqft)\s*(?:built-?up|super\s*built-?up)/i,
      ]);

      // 3. BHK Configuration
      let bhk = extractString([
        /([1-5]\s*BHK)/i,
        /([1-5]\s*BEDROOM)/i,
        /(one|two|three|four|five)\s*BHK/i,
      ]);
      if (bhk) {
        if (/one/i.test(bhk)) bhk = '1 BHK';
        else if (/two/i.test(bhk)) bhk = '2 BHK';
        else if (/three/i.test(bhk)) bhk = '3 BHK';
        else if (/four/i.test(bhk)) bhk = '4 BHK';
        else if (/five/i.test(bhk)) bhk = '4+ BHK';
        else {
          const digit = bhk.match(/[1-5]/)?.[0];
          bhk = digit ? (parseInt(digit) >= 4 ? '4+ BHK' : `${digit} BHK`) : '2 BHK';
        }
      }

      // 4. Region / Locality matching from the 22 predefined benchmark regions
      let matchedRegion: string | null = null;
      for (const reg of REGIONS_22) {
        const regex = new RegExp(`\\b${reg.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
        if (regex.test(cleanText)) {
          matchedRegion = reg;
          break;
        }
      }
      // Secondary fallback for sub-localities (e.g. "Dadar", "Bandra", "Andheri", "Thane")
      if (!matchedRegion) {
        if (/Dadar/i.test(cleanText)) matchedRegion = 'Dadar West';
        else if (/Bandra\s*West/i.test(cleanText)) matchedRegion = 'Bandra West';
        else if (/Bandra/i.test(cleanText)) matchedRegion = 'Bandra East';
        else if (/Andheri/i.test(cleanText)) matchedRegion = 'Andheri West';
        else if (/Worli/i.test(cleanText)) matchedRegion = 'Worli';
        else if (/Lower\s*Parel/i.test(cleanText)) matchedRegion = 'Lower Parel';
        else if (/Thane/i.test(cleanText)) matchedRegion = 'Thane West';
        else if (/Borivali/i.test(cleanText)) matchedRegion = 'Borivali West';
        else if (/Powai/i.test(cleanText)) matchedRegion = 'Powai';
        else if (/Juhu/i.test(cleanText)) matchedRegion = 'Juhu';
      }

      // 5. PIN Code
      const pinCode = extractString([
        /(?:pin(?:\s*code)?[\s:=]+)?(4000\d{2}|400[0-9]{3}|401[0-9]{3})/i,
      ]);

      // 6. Floor & Total Floors
      const floorNo = extractNumber([
        /(?:floor\s*no\.?|situated\s*on\s*(?:the)?)[\s:=]+([0-9]+)(?:st|nd|rd|th)?\s*floor/i,
        /floor[\s:=]+([0-9]+)/i,
      ]);

      const totalFloors = extractNumber([
        /(?:total\s*floors?|of\s*a\s*building\s*(?:comprising|having|of)?)[\s:=]+([0-9]+)\s*floors?/i,
        /(?:ground\s*\+\s*|stilt\s*\+\s*)([0-9]+)\s*(?:upper\s*)?floors?/i,
      ]);

      // 7. Property Age
      const buildingAge = extractNumber([
        /(?:age\s*of\s*building|building\s*age|property\s*age)[\s:=]+([0-9]+)\s*years?/i,
        /(?:constructed|completed)\s*in\s*year[\s:=]+([0-9]{4})/i,
      ]);

      // 8. Parking
      const parking = extractString([
        /(?:parking|allocated\s*parking|parking\s*space)[\s:=]+([^\n,.;]+)/i,
        /([1-2]\s*(?:Covered|Stilt|Open)\s*Parking)/i,
      ]);

      // 9. Occupancy
      let occupancy: 'Self-occupied' | 'Tenant' | 'Vacant' | null = null;
      if (/self-occupied|owner-occupied/i.test(cleanText)) occupancy = 'Self-occupied';
      else if (/tenant|rented|leased/i.test(cleanText)) occupancy = 'Tenant';
      else if (/vacant|unoccupied/i.test(cleanText)) occupancy = 'Vacant';

      // 10. Property Type
      let propertyType: 'Apartment' | 'Independent House' | 'Bungalow' | 'Villa' | null = null;
      if (/Apartment|Flat|Residential\s*Unit/i.test(cleanText)) propertyType = 'Apartment';
      else if (/Bungalow/i.test(cleanText)) propertyType = 'Bungalow';
      else if (/Villa/i.test(cleanText)) propertyType = 'Villa';
      else if (/Independent\s*House/i.test(cleanText)) propertyType = 'Independent House';

      // 11. Property Address
      const address = extractString([
        /(?:premises|situated\s*at|property\s*address|address)[\s:=]+([^\n]{10,90})(?:,|\.|$)/i,
        /(Flat\s*No\.?\s*[0-9A-Za-z\s,-]+CHS[^\n]{10,80})/i,
      ]);

      // 12. Purchaser / Borrower Name
      const purchaserName = extractString([
        /(?:purchaser|buyer|applicant|in\s*favour\s*of|transferee)[\s:=]+([A-Za-z\s.]{3,35})(?:,|\n|$)/i,
      ]);

      // Conflict Detection with Manual Inputs
      const conflicts: Array<{
        field: string;
        label: string;
        manualValue: any;
        pdfValue: any;
      }> = [];

      if (manualInputs.carpetArea && carpetArea && Math.abs(manualInputs.carpetArea - carpetArea) > 0.5) {
        conflicts.push({
          field: 'carpetArea',
          label: 'Carpet Area',
          manualValue: `${manualInputs.carpetArea} sq.ft`,
          pdfValue: `${carpetArea} sq.ft`,
        });
      }

      if (manualInputs.region && matchedRegion && manualInputs.region.toLowerCase() !== matchedRegion.toLowerCase()) {
        conflicts.push({
          field: 'region',
          label: 'Region / Locality',
          manualValue: manualInputs.region,
          pdfValue: matchedRegion,
        });
      }

      return NextResponse.json({
        success: true,
        document_category: 'property_info',
        fileName,
        conflicts,
        hasConflicts: conflicts.length > 0,
        extracted: {
          carpetArea: {
            value: carpetArea,
            status: carpetArea ? 'EXTRACTED' : 'NOT_FOUND',
            note: carpetArea ? undefined : 'Not found in PDF — please enter manually.',
          },
          builtUpArea: {
            value: builtUpArea,
            status: builtUpArea ? 'EXTRACTED' : 'NOT_FOUND',
            note: builtUpArea ? undefined : 'Not found in PDF — optional.',
          },
          bhk: {
            value: bhk,
            status: bhk ? 'EXTRACTED' : 'NOT_FOUND',
            note: bhk ? undefined : 'Not found in PDF — please enter manually.',
          },
          region: {
            value: matchedRegion,
            status: matchedRegion ? 'EXTRACTED' : 'NOT_FOUND',
            note: matchedRegion ? undefined : 'Not found in PDF — please select from 22 regions.',
          },
          propertyType: {
            value: propertyType,
            status: propertyType ? 'EXTRACTED' : 'NOT_FOUND',
            note: propertyType ? undefined : 'Not found in PDF — please select manually.',
          },
          address: {
            value: address,
            status: address ? 'EXTRACTED' : 'NOT_FOUND',
            note: address ? undefined : 'Not found in PDF — please enter manually.',
          },
          pinCode: {
            value: pinCode,
            status: pinCode ? 'EXTRACTED' : 'NOT_FOUND',
            note: pinCode ? undefined : 'Not found in PDF — please enter manually.',
          },
          floor: {
            value: floorNo,
            status: floorNo ? 'EXTRACTED' : 'NOT_FOUND',
            note: floorNo ? undefined : 'Not found in PDF — please enter manually.',
          },
          totalFloors: {
            value: totalFloors,
            status: totalFloors ? 'EXTRACTED' : 'NOT_FOUND',
            note: totalFloors ? undefined : 'Not found in PDF — optional.',
          },
          buildingAge: {
            value: buildingAge,
            status: buildingAge !== null ? 'EXTRACTED' : 'NOT_FOUND',
            note: buildingAge !== null ? undefined : 'Not found in PDF — please enter manually.',
          },
          parking: {
            value: parking,
            status: parking ? 'EXTRACTED' : 'NOT_FOUND',
            note: parking ? undefined : 'Not found in PDF — optional.',
          },
          occupancy: {
            value: occupancy,
            status: occupancy ? 'EXTRACTED' : 'NOT_FOUND',
            note: occupancy ? undefined : 'Not found in PDF — please select manually.',
          },
          purchaserName: {
            value: purchaserName,
            status: purchaserName ? 'EXTRACTED' : 'NOT_FOUND',
            note: purchaserName ? undefined : 'Not found in PDF.',
          },
        },
      });
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Category 2: Independent Valuation Report
    // ─────────────────────────────────────────────────────────────────────────────
    if (documentCategory === 'valuation_report') {
      const assessedValue = extractIndianCurrency([
        /(?:fair\s*market\s*value|assessed\s*(?:market\s*)?value|final\s*valuation|valuation\s*assessed|realizable\s*value)[\s:=]+(?:₹|rs\.?|inr)?\s*([0-9,]+(?:\.[0-9]+)?)\s*(cr(?:ore)?|lakhs?|lac)?/i,
        /(?:total\s*property\s*value|property\s*valuation)[\s:=]+(?:₹|rs\.?|inr)?\s*([0-9,]+(?:\.[0-9]+)?)\s*(cr(?:ore)?|lakhs?|lac)?/i,
      ]);

      const areaConsidered = extractNumber([
        /(?:area\s*considered|measurement\s*adopted|carpet\s*area\s*adopted)[\s:=]+([0-9,]+(?:\.[0-9]+)?)\s*(?:sq\.?\s*ft|sqft)/i,
      ]);

      const ratePerSqFt = extractNumber([
        /(?:rate\s*applied|effective\s*rate|rate\s*per\s*sq\.?\s*ft)[\s:=]+(?:₹|rs\.?|inr)?\s*([0-9,]+(?:\.[0-9]+)?)/i,
      ]);

      const valuerName = extractString([
        /(?:valuer|appraiser|inspected\s*by|surveyor)[\s:=]+([A-Za-z\s.&]{3,50}(?:associates|valuers|surveyors|consultants|llp|pvt|ltd)?)/i,
        /(P\.\s*V\.\s*Kulkarni\s*&\s*Associates)/i,
      ]);

      const inspectionDate = extractString([
        /(?:inspection\s*date|date\s*of\s*inspection|valuation\s*date)[\s:=]+([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4}|[0-9]{4}-[0-9]{2}-[0-9]{2})/i,
      ]);

      let conditionRating: string | null = null;
      if (/Excellent/i.test(cleanText)) conditionRating = 'Excellent';
      else if (/Good/i.test(cleanText)) conditionRating = 'Good';
      else if (/Average|Satisfactory/i.test(cleanText)) conditionRating = 'Average';
      else if (/Below\s*Average/i.test(cleanText)) conditionRating = 'Below Average';

      const comparablesCount = extractNumber([
        /([0-9]+)\s*(?:comparable\s*properties|comparables\s*used|comparable\s*sales)/i,
      ]);

      const valuationMethod = extractString([
        /(Sales\s*Comparison\s*Approach|Income\s*Approach|Cost\s*Approach|Discounted\s*Cash\s*Flow|Land\s*and\s*Building\s*Method)/i,
      ]);

      const adjustmentsNote = extractString([
        /(?:adjustments?\s*note|reconciliation\s*note|adjustments)[\s:=]+([^\n]{10,120})/i,
      ]);

      // Conflict Detection with Manual Inputs
      const conflicts: Array<{
        field: string;
        label: string;
        manualValue: any;
        pdfValue: any;
      }> = [];

      if (manualInputs.valuerAssessedValue && assessedValue && Math.abs(manualInputs.valuerAssessedValue - assessedValue) > 1000) {
        conflicts.push({
          field: 'valuerAssessedValue',
          label: 'Valuer Assessed Value',
          manualValue: `₹${(manualInputs.valuerAssessedValue / 1e7).toFixed(3)} Cr`,
          pdfValue: `₹${(assessedValue / 1e7).toFixed(3)} Cr`,
        });
      }

      return NextResponse.json({
        success: true,
        document_category: 'valuation_report',
        fileName,
        conflicts,
        hasConflicts: conflicts.length > 0,
        extracted: {
          assessedValue: {
            value: assessedValue,
            status: assessedValue ? 'EXTRACTED' : 'NOT_FOUND',
            note: assessedValue ? undefined : 'Not found in PDF — please enter manually.',
          },
          areaConsidered: {
            value: areaConsidered,
            status: areaConsidered ? 'EXTRACTED' : 'NOT_FOUND',
            note: areaConsidered ? undefined : 'Not found in PDF.',
          },
          ratePerSqFt: {
            value: ratePerSqFt,
            status: ratePerSqFt ? 'EXTRACTED' : 'NOT_FOUND',
            note: ratePerSqFt ? undefined : 'Not found in PDF.',
          },
          valuerName: {
            value: valuerName,
            status: valuerName ? 'EXTRACTED' : 'NOT_FOUND',
            note: valuerName ? undefined : 'Not found in PDF — please enter manually.',
          },
          inspectionDate: {
            value: inspectionDate,
            status: inspectionDate ? 'EXTRACTED' : 'NOT_FOUND',
            note: inspectionDate ? undefined : 'Not found in PDF — please enter manually.',
          },
          conditionRating: {
            value: conditionRating,
            status: conditionRating ? 'EXTRACTED' : 'NOT_FOUND',
            note: conditionRating ? undefined : 'Not found in PDF.',
          },
          comparablesCount: {
            value: comparablesCount,
            status: comparablesCount ? 'EXTRACTED' : 'NOT_FOUND',
            note: comparablesCount ? undefined : 'Not found in PDF.',
          },
          valuationMethod: {
            value: valuationMethod || 'Sales Comparison Approach',
            status: valuationMethod ? 'EXTRACTED' : 'NOT_FOUND',
            note: valuationMethod ? undefined : 'Defaulted to Sales Comparison Approach.',
          },
          adjustmentsNote: {
            value: adjustmentsNote,
            status: adjustmentsNote ? 'EXTRACTED' : 'NOT_FOUND',
            note: adjustmentsNote ? undefined : 'No explicit adjustments noted in report.',
          },
        },
      });
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Category 3: Balance Transfer Previous Valuation Report
    // ─────────────────────────────────────────────────────────────────────────────
    if (documentCategory === 'balance_transfer' || documentCategory === 'previous_valuation') {
      const previousValuation = extractIndianCurrency([
        /(?:previous\s*(?:bank\s*)?valuation|earlier\s*valuation|original\s*valuation|previous\s*appraisal)[\s:=]+(?:₹|rs\.?|inr)?\s*([0-9,]+(?:\.[0-9]+)?)\s*(cr(?:ore)?|lakhs?|lac)?/i,
        /(?:valuation\s*at\s*origin)[\s:=]+(?:₹|rs\.?|inr)?\s*([0-9,]+(?:\.[0-9]+)?)\s*(cr(?:ore)?|lakhs?|lac)?/i,
      ]);

      const previousValuationDate = extractString([
        /(?:previous\s*valuation\s*date|original\s*valuation\s*date|dated)[\s:=]+([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4}|[0-9]{4}-[0-9]{2}-[0-9]{2})/i,
      ]);

      const previousLender = extractString([
        /(?:originating\s*lender|previous\s*bank|existing\s*lender)[\s:=]+([A-Za-z\s.&]+(?:Bank|Housing|Finance|HFC)?)/i,
      ]);

      const previousRatePerSqFt = extractNumber([
        /(?:previous\s*rate|earlier\s*rate)[\s:=]+(?:₹|rs\.?|inr)?\s*([0-9,]+(?:\.[0-9]+)?)/i,
      ]);

      return NextResponse.json({
        success: true,
        document_category: 'balance_transfer',
        fileName,
        extracted: {
          previousValuation: {
            value: previousValuation,
            status: previousValuation ? 'EXTRACTED' : 'NOT_FOUND',
            note: previousValuation ? undefined : 'Not found in PDF — please enter manually.',
          },
          previousValuationDate: {
            value: previousValuationDate,
            status: previousValuationDate ? 'EXTRACTED' : 'NOT_FOUND',
            note: previousValuationDate ? undefined : 'Not found in PDF — please enter manually.',
          },
          previousLender: {
            value: previousLender,
            status: previousLender ? 'EXTRACTED' : 'NOT_FOUND',
            note: previousLender ? undefined : 'Not found in PDF.',
          },
          previousRatePerSqFt: {
            value: previousRatePerSqFt,
            status: previousRatePerSqFt ? 'EXTRACTED' : 'NOT_FOUND',
            note: previousRatePerSqFt ? undefined : 'Not found in PDF.',
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Document read successfully. No specific category matched.',
      textSnippet: cleanText.slice(0, 300),
    });
  } catch (err: any) {
    console.error('Extraction handler error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred during document processing.',
        details: err.message,
      },
      { status: 500 }
    );
  }
}
