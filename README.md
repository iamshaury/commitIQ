# CommitIQ

CommitIQ is an explainable developer activity analysis engine built on top of public GitHub data.

It focuses on transparency, confidence awareness, and clear reasoning rather than black-box evaluation.

## Why This Exists

GitHub profiles are noisy and hard to interpret quickly.
CommitIQ explores how observable activity signals can be structured into readable, explainable insights.

This project is an engineering exercise, not a hiring tool or skill evaluator.

## What It Does

- Analyzes public GitHub repositories
- Extracts activity and structure signals
- Applies configurable, rule-based scoring
- Attaches confidence levels to outputs
- Generates explainable summaries of results

## Key Design Principles

- Explainability over prediction
- Policy separated from execution logic
- Confidence-aware outputs
- Honest limitations

## What It Does NOT Do

- Does not evaluate code quality
- Does not predict developer skill or potential
- Does not use machine learning for decisions

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js
- APIs: GitHub REST API
- AI: Used only for natural language summaries

## Status

This project is actively evolving as an exploration of explainable analysis systems.

## License

MIT
