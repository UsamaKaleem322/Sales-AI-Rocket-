import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { client, teamMember, transcription } = await request.json();

    if (!client || !teamMember || !transcription) {
      return NextResponse.json(
        { error: 'Client, team member, and transcription are required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert sales and business analyst. Analyze the meeting transcription and provide comprehensive insights. Return the analysis in JSON format with the following structure:

{
  "summary": ["key point 1", "key point 2", "key point 3"],
  "actionItems": ["action item 1", "action item 2", "action item 3"],
  "sentiment": "positive|negative|neutral",
  "riskLevel": "low|medium|high",
  "healthScore": 85,
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "detailedInsights": {
    "communicationQuality": "excellent|good|fair|poor",
    "engagementLevel": "high|medium|low",
    "decisionMaking": "clear|unclear|pending",
    "stakeholderAlignment": "aligned|partially aligned|misaligned",
    "timelineRealism": "realistic|optimistic|unrealistic",
    "resourceAdequacy": "adequate|insufficient|excessive"
  },
  "businessMetrics": {
    "dealValue": "estimated value or range",
    "salesStage": "discovery|qualification|proposal|negotiation|closed",
    "competitivePosition": "strong|moderate|weak",
    "customerSatisfaction": "high|medium|low",
    "relationshipStrength": "strong|moderate|weak"
  },
  "keyTopics": ["topic 1", "topic 2", "topic 3"],
  "concerns": ["concern 1", "concern 2"],
  "opportunities": ["opportunity 1", "opportunity 2"],
  "nextSteps": ["next step 1", "next step 2", "next step 3"]
}`;

    const userPrompt = `Analyze this meeting transcription between ${teamMember} and ${client}:

${transcription}

Provide a comprehensive analysis focusing on:
1. Key insights and summary points
2. Action items and next steps
3. Sentiment and risk assessment
4. Business metrics and opportunities
5. Detailed insights about communication, engagement, and decision-making
6. Recommendations for follow-up`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const analysis = JSON.parse(response);
    const timestamp = new Date().toISOString();

    return NextResponse.json({
      success: true,
      analysis,
      timestamp,
      client,
      teamMember
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to analyze meeting' 
      },
      { status: 500 }
    );
  }
} 