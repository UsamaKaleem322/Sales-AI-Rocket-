import { AnalysisResponse } from './openai';

// Simple in-memory database (replace with real database in production)
class InMemoryDatabase {
  private analyses: AnalysisResponse[] = [];
  private stats = {
    totalAnalyses: 0,
    activeUsers: 12500,
    salesGrowth: 85,
    reportsGenerated: 0,
    responseTime: 95,
  };

  // Analysis operations
  async saveAnalysis(analysis: AnalysisResponse): Promise<AnalysisResponse> {
    this.analyses.push(analysis);
    this.stats.totalAnalyses++;
    this.stats.reportsGenerated++;
    return analysis;
  }

  async getAnalyses(): Promise<AnalysisResponse[]> {
    return this.analyses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAnalysisById(id: string): Promise<AnalysisResponse | null> {
    return this.analyses.find(a => a.id === id) || null;
  }

  async deleteAnalysis(id: string): Promise<boolean> {
    const index = this.analyses.findIndex(a => a.id === id);
    if (index > -1) {
      this.analyses.splice(index, 1);
      this.stats.totalAnalyses--;
      return true;
    }
    return false;
  }

  // Stats operations
  async getStats() {
    return {
      ...this.stats,
      totalAnalyses: this.analyses.length,
      reportsGenerated: this.analyses.length,
    };
  }

  async updateStats(newStats: Partial<typeof this.stats>) {
    this.stats = { ...this.stats, ...newStats };
    return this.stats;
  }
}

export const db = new InMemoryDatabase();

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