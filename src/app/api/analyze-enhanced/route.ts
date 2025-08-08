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

    const systemPrompt = `You are an expert sales and business analyst. Analyze the meeting transcription and provide comprehensive insights. 

IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text. The response must be parseable JSON.

CRITICAL: Each summary point, action item, and recommendation must be a complete, well-formed sentence with proper punctuation (periods, commas, etc.). Do not run sentences together.

Return the analysis in this exact JSON structure:

{
  "summary": ["Complete sentence with proper punctuation.", "Another complete sentence with proper punctuation.", "Third complete sentence with proper punctuation."],
  "actionItems": ["Complete action item sentence with proper punctuation.", "Another complete action item sentence.", "Third complete action item sentence."],
  "sentiment": "positive|negative|neutral",
  "riskLevel": "low|medium|high",
  "healthScore": 85,
  "recommendations": ["Complete recommendation sentence with proper punctuation.", "Another complete recommendation sentence.", "Third complete recommendation sentence."],
  "detailedInsights": {
    "communicationQuality": "excellent|good|fair|poor",
    "engagementLevel": "high|medium|low",
    "decisionMaking": "clear|unclear|pending",
    "stakeholderAlignment": "aligned|partially aligned|misaligned",
    "timelineRealism": "realistic|optimistic|unrealistic",
    "resourceAdequacy": "adequate|insufficient|excessive"
  },
  "businessMetrics": {
    "dealValue": "Complete sentence describing estimated value or range.",
    "salesStage": "discovery|qualification|proposal|negotiation|closed",
    "competitivePosition": "strong|moderate|weak",
    "customerSatisfaction": "high|medium|low",
    "relationshipStrength": "strong|moderate|weak"
  },
  "keyTopics": ["Complete sentence describing topic 1.", "Complete sentence describing topic 2.", "Complete sentence describing topic 3."],
  "concerns": ["Complete sentence describing concern 1.", "Complete sentence describing concern 2."],
  "opportunities": ["Complete sentence describing opportunity 1.", "Complete sentence describing opportunity 2."],
  "nextSteps": ["Complete sentence describing next step 1.", "Complete sentence describing next step 2.", "Complete sentence describing next step 3."]
}`;

    const userPrompt = `Analyze this meeting transcription between ${teamMember} and ${client}:

${transcription}

Provide a comprehensive analysis focusing on:
1. Key insights and summary points (write as complete, well-formed sentences with proper punctuation)
2. Action items and next steps (write as complete, actionable sentences with proper punctuation)
3. Sentiment and risk assessment
4. Business metrics and opportunities
5. Detailed insights about communication, engagement, and decision-making
6. Recommendations for follow-up (write as complete, actionable sentences with proper punctuation)

CRITICAL: Each summary point, action item, and recommendation must be a complete sentence with proper punctuation (periods, commas, etc.). Do not run sentences together. Ensure proper spacing between sentences.`;

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

    // Clean the response to extract pure JSON
    let cleanedResponse = response.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const analysis = JSON.parse(cleanedResponse);
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