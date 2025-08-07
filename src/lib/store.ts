import { create } from 'zustand';

export interface AnalysisResult {
  id: string;
  client?: string;
  teamMember?: string;
  transcription?: string;
  title?: string;
  createdAt?: Date;
  type?: string;
  summary?: string[];
  insights?: string[];
  recommendations?: string[];
  metrics?: {
    score?: number;
    trend?: string;
    confidence?: number;
    sentiment?: string;
    riskLevel?: string;
  };
  analysis?: {
    summary: string[];
    actionItems: string[];
    sentiment: string;
    riskLevel: string;
    healthScore: number;
    recommendations: string[];
    detailedInsights?: {
      communicationQuality: string;
      engagementLevel: string;
      decisionMaking: string;
      stakeholderAlignment: string;
      timelineRealism: string;
      resourceAdequacy: string;
    };
    businessMetrics?: {
      dealValue: string;
      salesStage: string;
      competitivePosition: string;
      customerSatisfaction: string;
      relationshipStrength: string;
    };
    keyTopics?: string[];
    concerns?: string[];
    opportunities?: string[];
    nextSteps?: string[];
  };
  timestamp?: string;
}

interface StoreState {
  analyses: AnalysisResult[];
  isLoading: boolean;
  error: string | null;
  filters: {
    client: string;
    teamMember: string;
    sentiment: string;
    riskLevel: string;
    dateFrom: string;
    dateTo: string;
  };
  addAnalysis: (analysis: AnalysisResult) => void;
  loadAnalyses: () => Promise<void>;
  deleteAnalysis: (id: string) => Promise<void>;
  setFilters: (filters: Partial<StoreState['filters']>) => void;
  clearFilters: () => void;
  getAnalysesByClient: (client: string) => AnalysisResult[];
  getAnalysesByTeamMember: (teamMember: string) => AnalysisResult[];
}

export const useAnalysisStore = create<StoreState>((set, get) => ({
  analyses: [],
  isLoading: false,
  error: null,
  filters: {
    client: '',
    teamMember: '',
    sentiment: '',
    riskLevel: '',
    dateFrom: '',
    dateTo: '',
  },

  addAnalysis: async (analysis: AnalysisResult) => {
    try {
      set({ isLoading: true, error: null });
      
      // Save to database
      const response = await fetch('/api/analyses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysis),
      });

      if (!response.ok) {
        throw new Error('Failed to save analysis');
      }

      // Add to local state
      set((state: StoreState) => ({ 
        analyses: [analysis, ...state.analyses],
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add analysis',
        isLoading: false 
      });
    }
  },

  loadAnalyses: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { filters } = get();
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/analyses?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to load analyses');
      }

      const data = await response.json();
      
      if (data.success) {
        set({ analyses: data.analyses, isLoading: false });
      } else {
        throw new Error(data.error || 'Failed to load analyses');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load analyses',
        isLoading: false 
      });
    }
  },

  deleteAnalysis: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch(`/api/analyses?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete analysis');
      }

      // Remove from local state
      set((state: StoreState) => ({ 
        analyses: state.analyses.filter(a => a.id !== id),
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete analysis',
        isLoading: false 
      });
    }
  },

  setFilters: (newFilters: Partial<StoreState['filters']>) => {
    set((state: StoreState) => ({ 
      filters: { ...state.filters, ...newFilters } 
    }));
  },

  clearFilters: () => {
    set({ 
      filters: {
        client: '',
        teamMember: '',
        sentiment: '',
        riskLevel: '',
        dateFrom: '',
        dateTo: '',
      } 
    });
  },

  getAnalysesByClient: (client: string) => {
    const { analyses } = get();
    return analyses.filter(analysis => 
      analysis.client?.toLowerCase().includes(client.toLowerCase())
    );
  },

  getAnalysesByTeamMember: (teamMember: string) => {
    const { analyses } = get();
    return analyses.filter(analysis => 
      analysis.teamMember?.toLowerCase().includes(teamMember.toLowerCase())
    );
  },
})); 