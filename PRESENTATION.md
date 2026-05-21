# Presentation Guide — GitHub Copilot Testing Demo

## Overview

This guide walks through demonstrating GitHub Copilot's automated testing capabilities using the Tauri Todo App.

---

## Slide 1: Introduction

**Title:** _"From Zero to Tested: GitHub Copilot + Automated Testing"_

**Key points:**
- This is a Tauri v2 desktop app (Rust + React)
- We'll show how Copilot accelerates the full testing lifecycle
- Three test layers: Unit → Functional → Load

---

## Slide 2: The App

**Demo: Show the running app**

```bash
npm run dev
# or
npm run tauri dev
```

Walk through:
- Adding a todo
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

## Slide 5: Functional Test Auto-Discovery

**Title:** _"CI auto-discovers Playwright tests"_

**Demo steps:**
1. Show `e2e/todo.spec.ts`
2. Show `.github/workflows/functional-tests.yml`
3. Highlight the `find e2e -name "*.spec.ts"` discovery step
4. Ask Copilot: _"Add a Playwright test for adding multiple todos and verifying the count"_
5. The new spec file is automatically picked up by CI

**Talking points:**
- No manual CI config needed when adding new e2e tests
- Copilot can generate full Playwright tests from natural language
- Follows AAA pattern (Arrange, Act, Assert)

---

## Slide 6: Issue-Triggered Test Triage

**Title:** _"GitHub Issues → Automated test proposals"_

**Demo steps:**
1. Go to the repo Issues tab
2. Create a new issue titled: `[LOAD TEST] Todo API performance under 100 concurrent users`
3. Watch the `issue-test-triage.yml` workflow trigger
4. Show the bot comment with:
   - Detected test type: Load Test
   - Generated NeoLoad YAML scenario
   - Generated Playwright spec template
   - Next steps checklist

**Talking points:**
- Issue title keywords trigger different test types
- `[LOAD TEST]` → NeoLoad scenario scaffolding
- `[FUNCTIONAL TEST]` → Playwright spec scaffolding
- `test-request` label → General test proposal
- Bot adds `tests-proposed` label automatically

---

## Slide 7: NeoLoad Integration

**Title:** _"Load testing with NeoLoad"_

**Show:** `neoload/scenarios/example-load-test.yml`

Key elements:
- Ramp-up: 1 → 50 users over 60 seconds
- Sustained load: 50 users for 5 minutes
- Assertions: avg response < 2s, error rate < 1%

**Talking points:**
- NeoLoad scenarios are version-controlled alongside code
- Auto-generated from issues, refined by engineers
- Integrates with Tricentis NeoLoad platform

---

## Slide 8: Copilot Configuration

**Title:** _"Teaching Copilot about your project"_

**Show:** `.github/copilot-instructions.md`

```markdown
## Testing Guidelines
When generating unit tests:
- Use Vitest + @testing-library/react for frontend
- Test each function/component in isolation
- Mock localStorage and Tauri API calls
```

**Show:** `.github/copilot-setup-steps.yml`
- Pre-installs Node, Rust, and Copilot optimizations in cloud agent

**Talking points:**
- `copilot-instructions.md` gives Copilot project context
- No more repeating "use Vitest" every time
- `copilot-setup-steps.yml` prepares the cloud agent environment

---

## Slide 9: Full CI Pipeline

**Title:** _"Everything runs in CI automatically"_

```
Push/PR
  │
  ├── Frontend Unit Tests (Vitest)
  ├── Rust Unit Tests (cargo test)
  └── Build Check (tsc + vite build)

Merge to main
  └── Functional Tests (Playwright auto-discovery)

Issues
  └── Test Triage Bot (NeoLoad + Playwright proposals)
```

---

## Slide 10: Key Takeaways

1. **Copilot accelerates** unit test writing — not just code
2. **Auto-discovery** means less CI maintenance overhead
3. **Issue triage bot** closes the loop between requirements and tests
4. **Copilot instructions** make AI assistance consistent across the team
5. **NeoLoad integration** brings performance testing into the dev workflow

---

## Q&A Prompts

- "Can Copilot generate tests for existing untested code?"
- "How do I add a new Playwright test?"
- "How does the NeoLoad scenario get executed?"
- "Can I customize what the triage bot proposes?"
