import { ANALYSIS_CONFIG } from "./analysis.config.js";
import { generateRecruiterSummary } from "../services/aiService.js";

// 1. Recency (Recency > Volume)
// Answers: "Are they currently coding?"
const calculateRecency = (repos) => {
    const { windowDays } = ANALYSIS_CONFIG.signals.recency;
    const windowDate = new Date();
    windowDate.setDate(windowDate.getDate() - windowDays);

    const activeRepos = repos.filter(repo => new Date(repo.pushed_at) > windowDate);
    const activeReposCount = activeRepos.length;

    // A simple score or label could be derived, but we return the raw metric
    return activeReposCount;
};

// 2. Project Completion Signal
// Answers: "Do they ship or just start?"
// Metric: CompletedProjectsRatio (Projects with README & Homepage vs Total)
const calculateCompletion = (repos) => {
    if (!repos.length) return 0;
    
    // We treat "Completion" as having a README AND (Homepage OR Docs)
    // Actually, prompt says "README present, Deployed link... Clear structure"
    // We'll approximate "Completed" as has_readme + (homepage OR has_pages OR description joined with > 50 chars)
    
    const completed = repos.filter(repo => {
        const hasReadme = repo.has_readme;
        const hasDeploy = repo.homepage || repo.has_pages;
        // const isNotTiny = repo.size > 100; // Filter out "hello world" if needed, but "Completion" often implies docs + deploy
        
        return hasReadme && hasDeploy;
    });

    return Number((completed.length / repos.length).toFixed(2));
};

// 3. Focus / Narrative Coherence
// Answers: "What kind of engineer is this?"
// Metric: TopStackRatio (Percentage of repos aligned to top language)
const calculateFocus = (repos) => {
    if (!repos.length) return { topLanguage: "None", ratio: 0 };

    const counts = {};
    repos.forEach(r => {
        if (r.language) {
            counts[r.language] = (counts[r.language] || 0) + 1;
        }
    });

    let topLang = "None";
    let maxCount = 0;

    Object.entries(counts).forEach(([lang, count]) => {
        if (count > maxCount) {
            maxCount = count;
            topLang = lang;
        }
    });

    const ratio = Number((maxCount / repos.length).toFixed(2));
    return { topLanguage: topLang, ratio };
};

// 4. Project Depth (Complexity Tolerance)
// Answers: "Can they handle non-trivial systems?"
// Metric: DeepProjectCount (Repo size > threshold, has README)
const calculateDepth = (repos) => {
    const { sizeThreshold } = ANALYSIS_CONFIG.signals.complexity;
    
    // Simple approximation: Size > threshold KB
    // Ideally we'd look for "number of folders", "config files" etc. if we had file trees.
    const deepProjects = repos.filter(r => r.size > sizeThreshold && r.has_readme);
    
    return deepProjects.length;
};

// 5. External Validation (Soft Signal)
// Answers: "Has anyone else cared?"
// Metric: ExternalInterestScore (Log scaled stars + forks)
const calculateValidation = (repos) => {
    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
    const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
    
    // Log scale to dampen viral outliers
    // Score = log2(Stars + Forks*2 + 1) * 10 or similar? 
    // The prompt says "Stars (log scaled)".
    // Let's just return the raw counts and maybe a composite score 0-100.
    
    const rawScore = totalStars + (totalForks * 2);
    // Logarithmic scaling: 10 stars -> ~3.3, 100 stars -> ~6.6, 1000 stars -> ~10
    // We can map this to a loose 0-100 "Interest Score" if we assume ~500 stars is "High".
    // But let's stick to a simpler metric for display: Total External Interactions.
    
    return {
        totalStars,
        totalForks,
        score: Math.min(100, Math.round(Math.log2(rawScore + 1) * 10)) // Simple log heuristic
    };
};

// 6. Consistency Over Time
// Answers: "Is this sustainable behavior?"
// Metric: ActiveMonthsLast12 (Distinct months with activity)
const calculateConsistency = (repos) => {
    const oneYearAgo = new Date();
    oneYearAgo.setMonth(oneYearAgo.getMonth() - 12);
    
    const activityMonths = new Set();
    
    repos.forEach(repo => {
        const pushDate = new Date(repo.pushed_at);
        if (pushDate > oneYearAgo) {
            // Key: "YYYY-MM"
            const key = `${pushDate.getFullYear()}-${pushDate.getMonth()}`;
            activityMonths.add(key);
        }
        // Created at also signals activity
        const createDate = new Date(repo.created_at);
        if (createDate > oneYearAgo) {
            const key = `${createDate.getFullYear()}-${createDate.getMonth()}`;
            activityMonths.add(key);
        }
    });

    return activityMonths.size;
};

// 7. Engineering Hygiene
// Answers: "Do they care about quality?"
// Metric: HygieneScore
// We can't check .gitignore or commit messages easily without more API calls.
// We WILL use: README presence, Description presence, License presence (if available).
const calculateHygiene = (repos) => {
    if (!repos.length) return 0;
    
    let hygienePoints = 0;
    const totalPossible = repos.length * 3; // 3 checks per repo
    
    repos.forEach(repo => {
        if (repo.has_readme) hygienePoints += 1;
        if (repo.description && repo.description.length > 10) hygienePoints += 1;
        if (repo.license) hygienePoints += 1; // GitHub repo object usually has `license` field (object or null)
    });
    
    return Math.round((hygienePoints / totalPossible) * 100);
};

export const analyzeRepos = async (repos) => {
    // Calculate all signals
    const activeReposLast90Days = calculateRecency(repos);
    const completedProjectsRatio = calculateCompletion(repos);
    const { topLanguage, ratio: topStackRatio } = calculateFocus(repos);
    const deepProjectCount = calculateDepth(repos);
    const validation = calculateValidation(repos);
    const activeMonthsLast12 = calculateConsistency(repos);
    const hygieneScore = calculateHygiene(repos);

    // Prepare data for AI Summary
    const signals = {
        activeReposLast90Days,
        completedProjectsRatio,
        topLanguage,
        topStackRatio,
        deepProjectCount,
        externalInterest: validation.score,
        activeMonthsLast12,
        hygieneScore
    };

    // Generate AI Summary
    const aiSummary = await generateRecruiterSummary(signals);

    // Return the specific structure requested
    return {
        activeReposLast90Days,
        completedProjectsRatio,
        topStackRatio,
        dominantLanguage: topLanguage, // Helpful context
        deepProjectCount,
        externalInterestScore: validation.score,
        totalStars: validation.totalStars,
        totalForks: validation.totalForks,
        activeMonthsLast12,
        hygieneScore,
        aiSummary,
        totalRepos: repos.length
    };
};
