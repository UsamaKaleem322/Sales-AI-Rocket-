import { NextRequest, NextResponse } from 'next/server';
import { generateAnalysis } from '@/lib/openai';
import { db, CreateAnalysisData } from '@/lib/database';

export async function GET() {
  try {
    const analyses = await db.getAnalyses();
    return NextResponse.json({ success: true, data: analyses });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateAnalysisData = await request.json();
    
    if (!body.type || !body.title) {
      return NextResponse.json(
        { success: false, error: 'Type and title are required' },
        { status: 400 }
      );
    }

    // Generate AI analysis
    const analysis = await generateAnalysis({
      type: body.type,
      data: body.data,
      prompt: body.prompt,
    });

    // Save to database
    const savedAnalysis = await db.saveAnalysis(analysis);

    return NextResponse.json({ 
      success: true, 
      data: savedAnalysis 
    });
  } catch (error) {
    console.error('Analysis creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create analysis' },
      { status: 500 }
    );
  }
}