import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AnalysisRequest {
  type: 'sales' | 'performance' | 'market' | 'customer';
  data: any;
  prompt?: string;
}

export interface AnalysisResponse {
  id: string;
  type: string;
  title: string;
  summary: string | string[];
  insights: string[];
  recommendations: string[];
  metrics: {
    score: number;
    trend: 'up' | 'down' | 'stable';
    confidence: number;
    sentiment?: string;
    riskLevel?: string;
  };
  createdAt: Date;
}

export async function generateAnalysis(request: AnalysisRequest): Promise<AnalysisResponse> {
  const systemPrompt = `You are an expert sales and business analyst. Analyze the provided data and return insights in JSON format with the following structure:
  {
    "title": "Analysis Title",
    "summary": "Brief summary of findings",
    "insights": ["insight1", "insight2", "insight3"],
    "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
    "metrics": {
      "score": 85,
      "trend": "up",
      "confidence": 92
    }
  }`;

  const userPrompt = request.prompt || `Analyze this ${request.type} data: ${JSON.stringify(request.data)}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from OpenAI');

    const analysisData = JSON.parse(response);
    
    return {
      id: `analysis_${Date.now()}`,
      type: request.type,
      title: analysisData.title || `${request.type.charAt(0).toUpperCase() + request.type.slice(1)} Analysis`,
      summary: analysisData.summary || 'Analysis completed successfully',
      insights: analysisData.insights || ['No specific insights generated'],
      recommendations: analysisData.recommendations || ['No specific recommendations generated'],
      metrics: analysisData.metrics || { score: 75, trend: 'stable', confidence: 80 },
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('OpenAI Analysis Error:', error);
    throw new Error('Failed to generate analysis');
  }
}