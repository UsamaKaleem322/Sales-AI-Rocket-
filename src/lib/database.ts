import { AnalysisResponse } from './openai';
import { prisma } from './prisma';

// Database operations using Prisma
class PrismaDatabase {
  // Analysis operations
  async saveAnalysis(analysis: AnalysisResponse): Promise<AnalysisResponse> {
    console.log('Database saveAnalysis received:', JSON.stringify(analysis, null, 2));
    
    // Validate required fields
    if (!analysis.type || !analysis.title || !analysis.summary) {
      console.error('Validation failed:', {
        type: analysis.type,
        title: analysis.title,
        summary: analysis.summary,
        hasType: !!analysis.type,
        hasTitle: !!analysis.title,
        hasSummary: !!analysis.summary
      });
      throw new Error('Missing required fields: type, title, and summary are required');
    }

    const saved = await prisma.analysis.create({
      data: {
        id: analysis.id,
        type: analysis.type,
        title: analysis.title,
        summary: Array.isArray(analysis.summary) ? analysis.summary.join('\n') : analysis.summary,
        insights: JSON.stringify(analysis.insights || []),
        recommendations: JSON.stringify(analysis.recommendations || []),
        metrics: JSON.stringify(analysis.metrics || { score: 0, trend: 'stable', confidence: 0 }),
        teamMember: (analysis as any).teamMember || null,
        client: (analysis as any).client || null,
        transcription: (analysis as any).transcription || null,
        timestamp: (analysis as any).timestamp || null,
        createdAt: analysis.createdAt,
      },
    });

    // Update stats
    await this.updateStatsCount();

    return {
      ...analysis,
      createdAt: saved.createdAt,
    };
  }

  async getAnalyses(): Promise<AnalysisResponse[]> {
    const analyses = await prisma.analysis.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return analyses.map(analysis => ({
      id: analysis.id,
      type: analysis.type as any,
      title: analysis.title,
      summary: analysis.summary.includes('\n') ? analysis.summary.split('\n') : [analysis.summary],
      insights: JSON.parse(analysis.insights),
      recommendations: JSON.parse(analysis.recommendations),
      metrics: JSON.parse(analysis.metrics),
      teamMember: analysis.teamMember,
      client: analysis.client,
      transcription: analysis.transcription,
      timestamp: analysis.timestamp,
      createdAt: analysis.createdAt,
    }));
  }

  async getAnalysisById(id: string): Promise<AnalysisResponse | null> {
    const analysis = await prisma.analysis.findUnique({
      where: { id },
    });

    if (!analysis) return null;

    return {
      id: analysis.id,
      type: analysis.type as any,
      title: analysis.title,
      summary: analysis.summary.includes(' | ') ? analysis.summary.split(' | ') : [analysis.summary],
      insights: JSON.parse(analysis.insights),
      recommendations: JSON.parse(analysis.recommendations),
      metrics: JSON.parse(analysis.metrics),
      createdAt: analysis.createdAt,
    };
  }

  async deleteAnalysis(id: string): Promise<boolean> {
    try {
      await prisma.analysis.delete({
        where: { id },
      });
      await this.updateStatsCount();
      return true;
    } catch {
      return false;
    }
  }

  // Stats operations
  async getStats() {
    let stats = await prisma.stats.findFirst();
    
    if (!stats) {
      stats = await prisma.stats.create({
        data: {
          totalAnalyses: 0,
          activeUsers: 12500,
          salesGrowth: 85,
          reportsGenerated: 0,
          responseTime: 95,
        },
      });
    }

    const totalAnalyses = await prisma.analysis.count();
    
    return {
      totalAnalyses,
      activeUsers: stats.activeUsers,
      salesGrowth: stats.salesGrowth,
      reportsGenerated: totalAnalyses,
      responseTime: stats.responseTime,
    };
  }

  async updateStats(newStats: Partial<StatsData>) {
    let stats = await prisma.stats.findFirst();
    
    if (!stats) {
      stats = await prisma.stats.create({
        data: {
          totalAnalyses: 0,
          activeUsers: 12500,
          salesGrowth: 85,
          reportsGenerated: 0,
          responseTime: 95,
        },
      });
    }

    const updated = await prisma.stats.update({
      where: { id: stats.id },
      data: newStats,
    });

    return updated;
  }

  private async updateStatsCount() {
    const totalAnalyses = await prisma.analysis.count();
    let stats = await prisma.stats.findFirst();
    
    if (stats) {
      await prisma.stats.update({
        where: { id: stats.id },
        data: {
          totalAnalyses,
          reportsGenerated: totalAnalyses,
        },
      });
    }
  }
}

export const db = new PrismaDatabase();

// Export individual functions for API routes
export const getAllAnalyses = async () => {
  return await db.getAnalyses();
};

export const addAnalysis = async (analysis: AnalysisResponse) => {
  return await db.saveAnalysis(analysis);
};

export const deleteAnalysis = async (id: string) => {
  return await db.deleteAnalysis(id);
};

export const getAnalysisById = async (id: string) => {
  return await db.getAnalysisById(id);
};

export const getAnalysesByFilter = async (filters: any) => {
  const analyses = await db.getAnalyses();
  
  // Apply filters based on available properties
  return analyses.filter(analysis => {
    // Type filtering
    if (filters.type && analysis.type !== filters.type) return false;
    
    // Title filtering (partial match)
    if (filters.title && !analysis.title.toLowerCase().includes(filters.title.toLowerCase())) return false;
    
    // Date filtering
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      if (analysis.createdAt < fromDate) return false;
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      if (analysis.createdAt > toDate) return false;
    }
    
    // Trend filtering
    if (filters.trend && analysis.metrics.trend !== filters.trend) return false;
    
    // Sentiment filtering
    if (filters.sentiment && analysis.metrics.sentiment !== filters.sentiment) return false;
    
    // Risk level filtering
    if (filters.riskLevel && analysis.metrics.riskLevel !== filters.riskLevel) return false;
    
    // Team member filtering (extract from title)
    if (filters.teamMember) {
      const teamMember = analysis.title?.split(' - ')[1] || '';
      if (!teamMember.toLowerCase().includes(filters.teamMember.toLowerCase())) return false;
    }
    
    // Client filtering (extract from title)
    if (filters.client) {
      const client = analysis.title?.split(' - ')[0] || '';
      if (!client.toLowerCase().includes(filters.client.toLowerCase())) return false;
    }
    
    return true;
  });
};

// Types
export interface CreateAnalysisData {
  type: 'sales' | 'performance' | 'market' | 'customer';
  title: string;
  data: any;
  prompt?: string;
}

export interface StatsData {
  totalAnalyses: number;
  activeUsers: number;
  salesGrowth: number;
  reportsGenerated: number;
  responseTime: number;
}