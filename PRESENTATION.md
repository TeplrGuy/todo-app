# Presentation Guide — GitHub Copilot Testing Demo

## Overview

This guide walks through demonstrating GitHub Copilot's automated testing capabilities using the Tauri Todo App.

---

## Slide 1: Introduction

**Title:** _"From Zero to Tested: GitHub Copilot + Automated Testing"_

**Key points:**
- This is a Tauri v2 desktop app (Rust + React)
- We'll show how Copilot accelerates the full testing lifecycle
- Three test layers: Unit → Functional (NeoLoad) → Load (NeoLoad)
- All functional AND load testing powered by [NeoLoad by Tricentis](https://www.tricentis.com/lp/neoload-performance-load-testing-ppc)

---

## Slide 2: The App

**Demo: Show the running app**

```bash
npm run dev
# or
npm run tauri dev
```

Walk through:
- Adding a todo (seed data already pre-populated)
- Toggling completion
- Editing a title
- Deleting a todo
- Filtering (All/Active/Completed)
- Clear Completed

---

## Slide 3: Unit Tests with Copilot

**Title:** _"Copilot writes your unit tests"_

**Demo steps:**
1. Open `src/hooks/useTodos.ts`
2. In Copilot Chat: _"Generate Vitest unit tests for this hook covering all CRUD operations"_
3. Show the generated tests match `src/__tests__/useTodos.test.ts`
4. Run tests: `npm test`

**Talking points:**
- Copilot understands the hook's contract
- Tests cover happy paths AND edge cases (empty string, toggle twice)
- Uses `@testing-library/react` `renderHook` pattern automatically

---

## Slide 4: Component Tests

**Title:** _"Copilot tests UI components too"_

**Demo steps:**
1. Open `src/components/TodoItem.tsx`
2. Ask Copilot: _"Write tests for this component including edit mode and keyboard shortcuts"_
3. Show generated test covers: render, toggle, delete, edit, Escape key

**Talking points:**
- Copilot generates accessible queries (`getByRole`, `getByLabel`)
- Tests user interactions with `userEvent`
- Covers the full edit flow including cancel

---

## Slide 5: NeoLoad Functional Tests — Auto-Discovery

**Title:** _"NeoLoad validates every feature — CI auto-discovers the tests"_

**Demo steps:**
1. Open `neoload/functional/todo-functional.yml`
2. Walk through a user path — e.g. "Add Todo":
   - `navigate` → `fill` → `click` → `assert` (item appears in list)
3. Show `.github/workflows/functional-tests.yml`
4. Highlight the `find neoload/functional -name "*.yml"` discovery step
5. Ask Copilot: _"Generate a NeoLoad functional test for editing a todo and verifying the updated title"_
6. Drop the new YAML into `neoload/functional/` — CI picks it up automatically

**Talking points:**
- No CI config changes needed when adding new functional tests
- NeoLoad handles both functional (1 user) AND load (50–200 users) — single tool
- YAML is version-controlled alongside code; Copilot can generate it from natural language
- Follows Navigate→Act→Assert pattern

---

## Slide 6: Issue-Triggered Test Triage

**Title:** _"GitHub Issues → Automated NeoLoad test proposals"_

**Demo steps:**
1. Go to the repo Issues tab
2. Create a new issue titled: `[LOAD TEST] Todo App performance under 100 concurrent users`
3. Watch the `issue-test-triage.yml` workflow trigger
4. Show the bot comment with:
   - Detected test type: Load Test
   - Generated NeoLoad YAML scenario (rampup, constant, assertions)
   - Next steps checklist pointing to `neoload/scenarios/`

5. Now create: `[FUNCTIONAL TEST] Verify seed data loads on first visit`
6. Bot responds with a NeoLoad functional YAML scaffold (1 user, iteration-based)

**Talking points:**
- Issue title keywords trigger different test types
- `[LOAD TEST]` → NeoLoad load scenario scaffolding
- `[FUNCTIONAL TEST]` → NeoLoad functional scenario scaffolding
- `test-request` label → General NeoLoad test proposal
- Bot adds `tests-proposed` label automatically

---

## Slide 7: NeoLoad Load Test Scenarios

**Title:** _"Three load test scenarios, version-controlled"_

**Show:** `neoload/scenarios/example-load-test.yml`

Three pre-built scenarios:

| Scenario | Users | Duration | Purpose |
|----------|-------|----------|---------|
| Load Test | 1 → 50 | 6 min | Baseline performance |
| Stress Test | 1 → 200 | 5 min | Find breaking point |
| Soak Test | 30 | 30 min | Detect memory leaks |

**Talking points:**
- Scenarios are code — reviewed in PRs, tracked in git
- Auto-generated from issues, refined by engineers
- Integrates with [Tricentis NeoLoad platform](https://www.tricentis.com/lp/neoload-performance-load-testing-ppc)
- Run locally: `neoload run neoload/scenarios/example-load-test.yml`

---

## Slide 8: Copilot Configuration

**Title:** _"Teaching Copilot about your project"_

**Show:** `.github/copilot-instructions.md`

```markdown
## Testing Guidelines
When generating functional tests:
- Place in neoload/functional/ as *.yml files
- Use NeoLoad YAML: name, variables, user_paths, populations, scenarios
- Single virtual user (duration.type: iteration, count: 1)

When generating load tests:
- Place in neoload/scenarios/ as *.yml files
- Define rampup, constant population blocks
- Assert avg_response_time, error_rate, percentile_95
```

**Show:** `.github/copilot-setup-steps.yml`
- Pre-installs Node, Rust, and Copilot optimizations in cloud agent

**Talking points:**
- `copilot-instructions.md` gives Copilot the NeoLoad YAML schema context
- No more repeating "use NeoLoad format" every session
- `copilot-setup-steps.yml` prepares the cloud agent environment

---

## Slide 9: Full CI Pipeline

**Title:** _"Everything runs in CI automatically"_

```
Push/PR
  │
  ├── Frontend Unit Tests (Vitest)         ← npm test
  ├── Rust Unit Tests (cargo test)
  └── Build Check (tsc + vite build)

Push to src/ or neoload/functional/
  └── Functional Tests (NeoLoad auto-discovery)
        ├── Discovers neoload/functional/*.yml
        ├── Validates YAML structure
        └── Runs via NeoLoad CLI (if NEOLOAD_TOKEN set)

Issues [LOAD TEST] / [FUNCTIONAL TEST]
  └── Test Triage Bot → NeoLoad YAML proposal as issue comment
```

---

## Slide 10: Key Takeaways

1. **Copilot accelerates** unit test writing — not just code
2. **NeoLoad covers both** functional validation and performance testing — one tool
3. **Auto-discovery** means zero CI maintenance when adding new NeoLoad tests
4. **Issue triage bot** closes the loop between requirements and NeoLoad scenarios
5. **Copilot instructions** make AI assistance consistent across the team

---

## Q&A Prompts

- "Can Copilot generate NeoLoad tests for existing untested features?"
- "How is a NeoLoad functional test different from a load test?"
- "How do I add a new functional test to the auto-discovered suite?"
- "How does the NeoLoad scenario connect to the Tricentis platform?"
- "Can I customize what the triage bot proposes?"

