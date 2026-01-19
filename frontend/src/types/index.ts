export interface Contribution {
  rule: string;
  contribution: number;
  evidence: string;
}

export interface ScoreDetail {
  score: number;
  level: string;
  confidence: string;
  explanation: Contribution[];
  uncertainties: string[];
}

export interface AnalysisResult {
  totalRepos: number;
  frontend: ScoreDetail;
  backend: ScoreDetail;
  consistencyScore: number;
  consistencyLabel: string;
  seriousProjectsCount: number;
  seriousProjectsLevel: string;
  totalStars: number;
  totalForks: number;
  aiSummary: string;
  avatarUrl?: string;
  name?: string;
  bio?: string;
  followers?: number;
  following?: number;
  topLanguages: string[];
}
