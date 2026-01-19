import { ANALYSIS_CONFIG } from "./analysis.config.js";
import { generateRecruiterSummary } from "../services/aiService.js";

const getLevel = (score, type) => {
  const levels = ANALYSIS_CONFIG.levels[type];
  for (const level of levels) {
    if (score >= level.min) return level.label;
  }
  return "Beginner";
};

const calculateConsistency = (repos) => {
  const { windowDays, ratioWeight, countWeight, maxScore, levelThresholds } = ANALYSIS_CONFIG.consistency;
  
  const windowDate = new Date();
  windowDate.setDate(windowDate.getDate() - windowDays);

  const recentRepos = repos.filter(repo => new Date(repo.pushed_at) > windowDate);
  const activeRatio = recentRepos.length / (repos.length || 1);
  
  let countScore = recentRepos.length * countWeight;
  const maxCountScore = maxScore - ratioWeight; 
  
  let score = (activeRatio * ratioWeight) + Math.min(countScore, maxCountScore);
  score = Math.round(Math.min(score, maxScore));

  let label = "Low";
  for (const threshold of levelThresholds) {
    if (score >= threshold.min) {
        label = threshold.label;
        break;
    }
  }

  return { score, label };
};

const calculateSeriousness = (repos) => {
  const { starThreshold, sizeThreshold, seniorCount, midCount } = ANALYSIS_CONFIG.seriousness;
  let seriousCount = 0;

  repos.forEach(repo => {
    const isPopular = repo.stargazers_count >= starThreshold;
    const isDeployed = repo.has_pages || repo.homepage;
    const isSubstantial = repo.size > sizeThreshold && repo.has_readme; 

    if (isPopular || isDeployed || isSubstantial) {
      seriousCount++;
    }
  });

  let label = "Junior";
  if (seriousCount >= seniorCount) label = "Senior";
  else if (seriousCount >= midCount) label = "Mid-Level";

  return { count: seriousCount, label };
};

const detectUncertainties = (repos) => {
  const uncertainties = [];
  if (!repos.length) uncertainties.push("No public repositories found.");
  if (repos.length < 3) uncertainties.push("Low repository count reduces analysis confidence.");
  
  // Check for recent activity
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const recentCount = repos.filter(r => new Date(r.pushed_at) > ninetyDaysAgo).length;
  
  if (recentCount === 0) uncertainties.push("No activity detected in the last 90 days.");

  // Check for READMEs
  const readmeCount = repos.filter(r => r.has_readme).length;
  if (readmeCount < repos.length / 2) uncertainties.push("Many repositories lack documentation (README).");

  return uncertainties;
};

const mergeContributions = (contributions) => {
  const map = {};
  contributions.forEach(c => {
    if (!map[c.rule]) {
      map[c.rule] = { ...c, rawEvidence: [c.evidence] };
    } else {
      map[c.rule].contribution += c.contribution;
      map[c.rule].rawEvidence.push(c.evidence); 
    }
  });
  
  return Object.values(map).map(c => {
      // Format evidence
      const uniqueItems = [...new Set(c.rawEvidence)];
      let evidenceStr = "";
      
      if (uniqueItems.length <= 3) {
          evidenceStr = uniqueItems.join(", ");
      } else {
          evidenceStr = `${uniqueItems.slice(0, 3).join(", ")} and ${uniqueItems.length - 3} others`;
      }

      return {
          rule: c.rule,
          contribution: Number(c.contribution.toFixed(2)),
          evidence: evidenceStr
      };
  });
};

export const analyzeRepos = async (repos) => {
  const { scoringWeights } = ANALYSIS_CONFIG;
  const { weights } = scoringWeights;

  const backendContribs = [];
  const frontendContribs = [];

  let backendTotal = 0;
  let frontendTotal = 0;

  repos.forEach((repo) => {
    // Language Analysis
    const isBackendLang = scoringWeights.language.backend.includes(repo.language);
    if (isBackendLang) {
        backendTotal += weights.language;
        backendContribs.push({
            rule: "Language Proficiency",
            contribution: weights.language,
            evidence: `${repo.language} (${repo.name})`
        });
    }

    const isFrontendLang = scoringWeights.language.frontend.includes(repo.language);
    if (isFrontendLang) {
        frontendTotal += weights.language;
        frontendContribs.push({
            rule: "Language Proficiency",
            contribution: weights.language,
            evidence: `${repo.language} (${repo.name})`
        });
    }

    // Name Analysis
    const lowerName = repo.name.toLowerCase();
    const backendKeyword = scoringWeights.nameKeywords.backend.find(k => lowerName.includes(k));
    if (backendKeyword) {
        backendTotal += weights.name;
        backendContribs.push({
            rule: "Project Theme (Nomenclature)",
            contribution: weights.name,
            evidence: `"${backendKeyword}" in ${repo.name}`
        });
    }

    const frontendKeyword = scoringWeights.nameKeywords.frontend.find(k => lowerName.includes(k));
    if (frontendKeyword) {
         frontendTotal += weights.name;
         frontendContribs.push({
            rule: "Project Theme (Nomenclature)",
            contribution: weights.name,
            evidence: `"${frontendKeyword}" in ${repo.name}`
        });
    }

    // Size & Quality Analysis
    // Using a derived weight application
    if (repo.size > ANALYSIS_CONFIG.seriousness.sizeThreshold / 5) {
        if (isBackendLang || backendKeyword) {
             backendTotal += weights.size;
             backendContribs.push({
                rule: "Codebase Size",
                contribution: weights.size,
                evidence: `Substantial code in ${repo.name}`
             });
        }
        if (isFrontendLang || frontendKeyword) {
            frontendTotal += weights.size;
             frontendContribs.push({
                rule: "Codebase Size",
                contribution: weights.size,
                evidence: `Substantial code in ${repo.name}`
             });
        }
        // Fallback: if no specific language match but large, maybe minimal generic contribution? 
        // Current logic only adds to category if it 'belongs' to it implicitly via loops?
        // Actually original logic was: "if size > 100 -> backend += 0.2; frontend += 0.2". It enriched BOTH regardless of language.
        // I will preserve that behavior for now to maintain scores, but mark it as "General Engineering".
        if (!isBackendLang && !backendKeyword) { // Only add if not already added? 
            // Original code: unconditional addition.
             backendTotal += weights.size;
             backendContribs.push({ rule: "Codebase Size (Generic)", contribution: weights.size, evidence: `${repo.name} > ${ANALYSIS_CONFIG.seriousness.sizeThreshold/5}KB`});
        }
        if (!isFrontendLang && !frontendKeyword) {
             frontendTotal += weights.size;
             frontendContribs.push({ rule: "Codebase Size (Generic)", contribution: weights.size, evidence: `${repo.name} > ${ANALYSIS_CONFIG.seriousness.sizeThreshold/5}KB`});
        }
    }

    if (repo.has_readme) {
      // Original: unconditional +0.1 to both
      backendTotal += weights.readme;
      frontendTotal += weights.readme;
      backendContribs.push({ rule: "Documentation", contribution: weights.readme, evidence: `README in ${repo.name}`});
      frontendContribs.push({ rule: "Documentation", contribution: weights.readme, evidence: `README in ${repo.name}`});
    }
  });

  const consistency = calculateConsistency(repos);
  const seriousness = calculateSeriousness(repos);
  const uncertainties = detectUncertainties(repos);

  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

  const backendLevel = getLevel(backendTotal, 'backend');
  const frontendLevel = getLevel(frontendTotal, 'frontend');

  const signals = {
     backendLevel,
     frontendLevel,
     consistency: consistency.label, 
     projectQuality: seriousness.label,
     topLanguages: [...new Set(repos.map(r => r.language).filter(Boolean))].slice(0, 5)
  };

  const aiSummary = await generateRecruiterSummary(signals);

  return {
    backend: {
        score: Number(backendTotal.toFixed(2)),
        level: backendLevel,
        confidence: uncertainties.length > 2 ? "Low" : uncertainties.length > 0 ? "Medium" : "High",
        explanation: mergeContributions(backendContribs),
        uncertainties
    },
    frontend: {
        score: Number(frontendTotal.toFixed(2)),
        level: frontendLevel,
        confidence: uncertainties.length > 2 ? "Low" : uncertainties.length > 0 ? "Medium" : "High",
        explanation: mergeContributions(frontendContribs),
        uncertainties
    },
    totalRepos: repos.length,
    totalStars,
    totalForks,
    consistencyScore: consistency.score,
    consistencyLabel: consistency.label,
    seriousProjectsCount: seriousness.count,
    seriousProjectsLevel: seriousness.label,
    aiSummary,
    topLanguages: signals.topLanguages
  };
};
