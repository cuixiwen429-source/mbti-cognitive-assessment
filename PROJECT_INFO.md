# MBTI Cognitive Function Assessment — Project Overview for Codex

## Quick Summary

A scientific MBTI assessment web app that replaced traditional 120 Likert-scale questions with an **immersive branching story game** (5 chapters, ~23 decisions per user). Built with React 19 + TypeScript + Tailwind CSS v4 + Zustand + Recharts. Deployed on Vercel.

**Live URL**: `https://frontend-lemon-one-84.vercel.app`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| State | Zustand v5 |
| Routing | React Router v7 (SPA with Vercel rewrites) |
| Charts | Recharts v3 |
| Animation | CSS transitions + framer-motion (minimal use) |
| Persistence | localStorage (`mbti_cognitive_history` key) |
| Hosting | Vercel (automatic deploy from `main` branch) |

---

## File Structure

```
frontend/
├── src/
│   ├── App.tsx                          # 4 routes: / /test /result/:id /history
│   ├── main.tsx                         # React entry
│   ├── index.css                        # Tailwind imports + global dark theme
│   │
│   ├── types/
│   │   └── index.ts                     # ALL TypeScript types + constants (249 lines)
│   │       - FunctionScores, AssessmentResult, HistoryEntry
│   │       - StoryChapter, StoryDecision, StoryOption, StoryAnswer
│   │       - JobProfile, JobMatchResult, PersonalizedResult
│   │       - TYPE_FULL_TEMPLATES (16 type ideal function stacks)
│   │       - FUNC_NAMES, FUNC_LABELS, TYPE_DESCRIPTIONS
│   │
│   ├── data/
│   │   ├── scenarios.ts                 # Story content: 10 chapters, 42 decisions (616 lines)
│   │   ├── interpretations.ts           # 8 functions × 5 tiers × 5 fields = 200 text blocks (575 lines)
│   │   ├── jobs.ts                      # 80+ Chinese market jobs with function requirements (548 lines)
│   │   └── questions.json               # LEGACY: old 120-question bank (no longer used)
│   │
│   ├── utils/
│   │   ├── scoring.ts                   # Euclidean distance type matching + warnings (195 lines)
│   │   ├── storyScoring.ts              # Story answer scoring + branch resolution (234 lines)
│   │   ├── interpretation.ts            # Tier mapping + personalized result assembly
│   │   └── jobMatcher.ts                # Weighted cosine similarity job matching
│   │
│   ├── store/
│   │   └── testStore.ts                 # Zustand store: phase, result, history, localStorage (147 lines)
│   │
│   ├── pages/
│   │   ├── HomePage.tsx                 # Landing + recent 3 history entries
│   │   ├── TestPage.tsx                 # Branching story navigation engine (210 lines)
│   │   ├── ResultPage.tsx               # 5-tab results: overview/functions/dynamics/growth/quality (218 lines)
│   │   └── HistoryPage.tsx              # Full history list + compare mode
│   │
│   └── components/
│       ├── StoryScene.tsx               # Immersive story UI: particles, options, nav (226 lines)
│       ├── TypeMatch.tsx                # Best match + second match display
│       ├── RadarChart.tsx               # Recharts 8-axis radar
│       ├── FunctionStack.tsx            # Top 4 function visual stack
│       ├── FunctionInsight.tsx          # Expandable function interpretation card
│       ├── TypeDynamics.tsx             # Function relationship diagram + 4 analysis sections
│       ├── GrowthGuide.tsx              # Career TOP 10 + growth advice + style cards
│       ├── QualityReport.tsx            # Attention/consistency/social desirability report
│       ├── TabNavigation.tsx            # Horizontal scrollable tab bar
│       ├── ShareButton.tsx              # navigator.share API with clipboard fallback
│       ├── HistoryList.tsx              # History entries with delete + compare select
│       ├── CompareChart.tsx             # Recharts LineChart for multi-test comparison
│       ├── QuestionCard.tsx             # LEGACY: old question UI
│       ├── ProgressBar.tsx              # LEGACY: old test progress
│       └── ThemeToggle.tsx              # Dark mode toggle (always dark for story mode)
│
├── vercel.json                          # SPA rewrites: all routes → /index.html
├── package.json
└── dist/                                # Build output
```

---

## Core Architecture: How the Story Assessment Works

### Branching Tree (the key innovation)

```
Ch1: 迷雾森林 (id:1, shared, 5 decisions)
  ↓ (always)
Ch2: 岔路口 (id:2, shared, 5 decisions, branchType:'perceiving')
  ↓ [branch: Se+Si > Ne+Ni → S path, else N path]
  ├── Ch3a: 断崖困境 (id:31, S path, 5 decisions, branchType:'judging')
  └── Ch3b: 镜中迷宫 (id:32, N path, 5 decisions, branchType:'judging')
  ↓ [branch: Te+Ti > Fe+Fi → T path, else F path]
  ├── Ch4a: 孤塔试炼 (id:41, T path, 5 decisions)
  └── Ch4b: 围炉夜话 (id:42, F path, 5 decisions)
  ↓ [ending: based on dominant function group from ALL answers]
  ├── Ch5a: 建筑师 (id:51, Te/Ti dominant, 3 decisions)
  ├── Ch5b: 诗人   (id:52, Fe/Fi dominant, 3 decisions)
  ├── Ch5c: 探险家 (id:53, Se/Ne dominant, 3 decisions)
  └── Ch5d: 智者   (id:54, Ni/Si dominant, 3 decisions)
```

**Per user**: 5+5+5+5+3 = 23 decisions. **Total written**: 42 decisions across 10 chapters.

### How Branch Resolution Works (`storyScoring.ts`)

```ts
// BRANCH_MAP maps conditions to chapter IDs
BRANCH_MAP = {
  perceiving: { S: 31, N: 32 },
  judging:    { T: { 31: 41, 32: 41 }, F: { 31: 42, 32: 42 } },
  ending:     { TeTi: 51, FeFi: 52, SeNe: 53, NiSi: 54 }
}

// After completing a chapter, resolveNextChapter() is called:
// 1. If chapter.isEnding → return -1 (submit)
// 2. If chapter.branchType === 'perceiving' → compare Se+Si vs Ne+Ni
// 3. If chapter.branchType === 'judging' → compare Te+Ti vs Fe+Fi
// 4. Otherwise → resolveEnding() based on highest function group
```

### How Scoring Works

Each option in every decision has a `functions` weight map (e.g. `{ Se: 4, Si: 2 }`). Across all decisions:
1. `scoreStoryAnswers()` aggregates weighted function scores from all answers
2. Scores are normalized to 0-100
3. `buildFunctionStack()` orders functions by score
4. `computeTypeMatches()` calculates Euclidean distance from user scores to 16 MBTI template vectors → match percentages
5. `checkStoryQuality()` verifies attention check + cross-chapter consistency

### TestPage Navigation (Path Stack)

Instead of a flat array index, TestPage maintains a **path stack**:
```ts
path: number[]  // e.g. [1, 2, 31, 41, 51] = chapters visited
decisionIdx: number  // current decision within current chapter

// On "next": advance within chapter, or resolve branch to next chapter
// On "prev": go back within chapter, or pop path stack to previous chapter
// On submit: only when on last decision of an isEnding chapter
```

### Attention Check

Embedded in `ch1_d5` (shared chapter, so every user sees it): the diary mentions a "spiral symbol" but the user actually saw triangle symbols on the tree. Correct answer (option C, index 2) is to notice the contradiction. Options A/B/D all fail. No function weights assigned to this decision.

---

## Data Flow

```
User answers → StoryAnswer[] (accumulated in TestPage state)
     │
     ▼
scoreStoryAnswers() → FunctionScores (8 numbers 0-100)
     │
     ├──→ buildFunctionStack() → string[] (e.g. ['Ni','Te','Fi','Se'])
     ├──→ computeTypeMatches() → TypeMatch[] (16 types, Euclidean distance)
     ├──→ checkStoryQuality() → QualityReport
     │
     ▼
setResult() → Zustand store + localStorage (HistoryEntry)
     │
     ▼
navigate('/result/:id')
     │
     ▼
ResultPage: generatePersonalizedResult(scores)
     ├── FunctionInsight: 8 cards with tier-based interpretations
     ├── TypeDynamics: dominant-aux loop, tertiary temptation, inferior grip
     ├── GrowthGuide: top 10 job matches (weighted cosine similarity)
     └── QualityReport: attention check + consistency + warnings
```

---

## Key Types (simplified)

```ts
interface FunctionScores {
  Se: number; Si: number; Ne: number; Ni: number;
  Te: number; Ti: number; Fe: number; Fi: number;
}

interface StoryDecision {
  id: string;
  context: string;          // narrative context (replaces explicit questions)
  question: string;         // always '' in current version
  options: StoryOption[];
}

interface StoryOption {
  text: string;             // concrete action/feeling, NO subtext
  functions: Partial<FunctionScores>;  // weight mapping
}

interface StoryChapter {
  id: number;
  title: string; subtitle: string;
  scene: string;            // long description shown on first decision of chapter
  gradient: string;         // CSS gradient for background
  icon: string;             // emoji
  decisions: StoryDecision[];
  branchType?: 'perceiving' | 'judging';  // triggers branch after completion
  isEnding?: boolean;       // final chapter → shows "查看结局" button
  endingLabel?: string;     // human-readable ending name
  hasAttentionCheck?: boolean;
  attentionExpectedOption?: number;
  attentionDecisionIndex?: number;
}

interface JobProfile {
  title: string; category: string;
  functionRequirements: FunctionScores;  // 0-1 weight per function
  confidence: 1 | 2 | 3;    // ★★★ empirical, ★★☆ theoretical, ★☆☆ theory-only
  sources: string;
  matchReason: string;
}
```

---

## Scoring Pipeline Detail

### Type Matching (`scoring.ts`)
- Uses **Euclidean distance** from user's 8-function scores to 16 MBTI template vectors
- Templates defined in `TYPE_FULL_TEMPLATES`: 8-element arrays [Se,Si,Ne,Ni,Te,Ti,Fe,Fi] with weights 1-4
- Distance → match_percentage: `max(0, 100 - distance * 10)`
- Returns sorted TypeMatch[] with type_code, distance, match_percentage

### Job Matching (`jobMatcher.ts`)
- Uses **weighted cosine similarity** between user's normalized function scores and job's functionRequirements
- Stronger functions (higher user score) get higher weight in the cosine calculation
- Results sorted by match score, annotated with confidence stars
- Sources include CAPT Data Bank, arXiv:2504.17248 meta-analysis, BMC Medical Education 2024

### Interpretation Tiers (`interpretation.ts`)
- Scores mapped to 5 tiers: very_low (0-35), low (35-50), moderate (50-65), balanced (65-80), high (80-100)
- Each function × tier has: overview, dailyLife, work, relationships, growth
- Type dynamics: dominantAuxLoop, tertiaryTemptation, inferiorGrip, growthPath for each of 16 types

---

## State Management (Zustand)

```ts
interface TestStore {
  phase: 'idle' | 'testing' | 'processing' | 'result';
  result: AssessmentResult | null;
  history: HistoryEntry[];
  startTest(): void;
  setPhase(p): void;
  setResult(r): void;
  saveResult(): void;         // persists to localStorage
  loadHistoryFromStorage(): void;
  deleteHistory(id): void;
  clearHistory(): void;
}
```

localStorage key: `mbti_cognitive_history`
Format: `HistoryEntry[]` with id, createdAt (ISO), durationSeconds, full AssessmentResult

---

## Known Conventions

- **Always dark mode**: the story UI uses `bg-slate-950` base with CSS gradient overlays
- **No explicit questions**: all `decision.question` fields are `''` — context text drives the narrative
- **No subtext**: `StoryOption` has no `subtext` field (removed to avoid psychological priming)
- **Chapter IDs**: shared chapters use single digits (1,2), branch chapters use 2-digit codes (31,32,41,42), endings use 2-digit codes (51-54)
- **Functions ordering**: ALWAYS Se,Si,Ne,Ni,Te,Ti,Fe,Fi (this order is hardcoded in FUNC_NAMES)
- **Attention check**: always in a shared chapter (currently ch1_d5) so every user encounters it

---

## Research Basis for Career Matching

| Source | Content | Used For |
|--------|---------|----------|
| CAPT Data Bank (Myers & McCaulley 1985/1998) | Occupational type distributions | ★★★ confidence jobs |
| arXiv:2504.17248 (VarastehNezhad 2025) | 18,264 tech workers meta-analysis | Tech job function requirements |
| BMC Medical Education 2024 | Medical students MBTI-career values | Healthcare jobs |
| 青山资本 2024 | Chinese entrepreneur MBTI profiles | Startup/VC jobs |
| China HR Practice Data 2025 | TOP50 company HRD MBTI-function mapping | HR/management jobs |

---

## Deployment

- **Platform**: Vercel
- **Build**: `npm run build` (tsc + vite build)
- **Output**: `frontend/dist/`
- **SPA**: vercel.json rewrites all routes to `/index.html`
- **Deploy**: `git push` to `main` branch triggers automatic deployment

---

## Current State & Recent Changes

### Latest commit (05a6009): Branching story + multiple endings
- Replaced linear 28-decision story with branching tree (42 decisions total, ~23 per user)
- 4 unique endings based on dominant cognitive function
- Removed all subtext psychological hints from options
- Attention check now embedded naturally in story (Ch1_d5)
- TestPage navigation rewritten from flat index to path stack

### Previous major features
- 80+ Chinese market job profiles with research-backed confidence ratings
- 200 interpretation text blocks (8 functions × 5 tiers × 5 fields)
- 16 type dynamics analyses
- localStorage history with multi-test comparison charts
- Tab-based result page (overview/functions/dynamics/growth/quality)
- Share button with clipboard fallback

### Legacy artifacts (still in codebase but unused)
- `src/data/questions.json` — original 120 Likert-scale questions
- `src/components/QuestionCard.tsx` — old question UI component
- `src/components/ProgressBar.tsx` — old test progress bar
