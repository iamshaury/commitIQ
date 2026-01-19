export const ANALYSIS_CONFIG = {
  levels: {
    backend: [
      { min: 3, label: "Strong" },
      { min: 1.5, label: "Moderate" },
      { min: 0, label: "Beginner" }
    ],
    frontend: [
      { min: 3, label: "Strong" },
      { min: 1.5, label: "Moderate" },
      { min: 0, label: "Beginner" }
    ]
  },

  consistency: {
    windowDays: 90,
    ratioWeight: 50,
    countWeight: 10,
    maxScore: 100,
    levelThresholds: [
      { min: 70, label: "High" },
      { min: 40, label: "Moderate" },
      { min: 0, label: "Low" }
    ]
  },

  seriousness: {
    starThreshold: 2,
    sizeThreshold: 500,
    seniorCount: 5,
    midCount: 2
  },

  scoringWeights: {
    language: {
      backend: ["Python", "Java", "Go", "Rust", "C++", "C#"],
      frontend: ["JavaScript", "TypeScript", "HTML", "CSS"]
    },
    nameKeywords: {
      backend: ["api", "server"],
      frontend: ["react", "web", "ui"]
    },
    weights: {
      language: 0.4,
      name: 0.3,
      size: 0.2,
      readme: 0.1
    }
  }
};
