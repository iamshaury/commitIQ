export interface AnalysisResult {
  activeReposLast90Days: number;
  completedProjectsRatio: number;
  topStackRatio: number;
  dominantLanguage: string;
  deepProjectCount: number;
  externalInterestScore: number;
  totalStars: number;
  totalForks: number;
  activeMonthsLast12: number;
  hygieneScore: number;
  aiSummary: string;
  totalRepos: number;
  
  // User Profile
  avatarUrl?: string;
  name?: string;
  bio?: string;
  followers?: number;
  following?: number;
}
