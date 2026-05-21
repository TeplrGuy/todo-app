# # Todo App — Tauri v2 + React/TypeScript

A full-featured desktop Todo application built with Tauri v2 and React/TypeScript, showcasing GitHub Copilot's automated testing capabilities.

## Architecture

```
┌─────────────────────────────────────────┐
│          Frontend (React/TS)            │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐  │
│  │ AddTodo │ │ TodoList │ │TodoItem │  │
│  └─────────┘ └──────────┘ └─────────┘  │
│         useTodos hook (CRUD)            │
│         localStorage persistence        │
└──────────────┬──────────────────────────┘
               │ Tauri IPC (invoke)
┌──────────────▼──────────────────────────┐
│         Rust Backend (Tauri v2)         │
│   greet() · get_app_version()           │
└─────────────────────────────────────────┘
```

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Rust + Tauri v2
- **Storage**: Browser `localStorage`
- **Testing**: Vitest (unit) · Playwright (e2e) · NeoLoad (load)

## Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [Rust](https://rustup.rs/) (stable)
- [Tauri CLI prerequisites](https://tauri.app/start/prerequisites/)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build

# Launch Tauri desktop app (dev)
npm run tauri dev

# Build Tauri desktop app
npm run tauri build
```

## Testing

```bash
# Run all unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Run e2e/functional tests (requires running app)
npx playwright test
```

## Testing Strategy

| Layer | Tool | Location |
|-------|------|----------|
| Unit | Vitest + Testing Library | `src/__tests__/` |
| Functional/E2E | Playwright | `e2e/` |
| Load | NeoLoad | `neoload/scenarios/` |
| Rust | `cargo test` | `src-tauri/src/lib.rs` |

## GitHub Actions Workflows

| Workflow | Trigger | Description |
|----------|---------|-------------|
| `ci.yml` | push/PR to main | Runs frontend + Rust tests, build check |
| `functional-tests.yml` | push to src/ | Auto-discovers and runs Playwright tests |
| `issue-test-triage.yml` | Issue opened/labeled | AI-proposes test cases for `[TEST]`/`[LOAD TEST]` issues |

## GitHub Copilot Features

This repo demonstrates Copilot's testing capabilities:

- **Unit test generation** — Copilot can generate Vitest tests for hooks, utils, and components
- **Functional test discovery** — The CI pipeline auto-discovers any `*.spec.ts` added to `e2e/`
- **Issue-triggered triage** — Opening a `[LOAD TEST]` or `[FUNCTIONAL TEST]` issue triggers the bot to propose NeoLoad/Playwright test scaffolding

See `.github/copilot-instructions.md` for AI context configuration.

## NeoLoad Integration

Performance tests live in `neoload/scenarios/`. See [`neoload/README.md`](neoload/README.md) for setup details.

## Project Structure

```
todo-app/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── __tests__/          # Unit tests
├── src-tauri/              # Rust/Tauri backend
│   └── src/
│       ├── main.rs
│       └── lib.rs          # Commands + tests
├── e2e/                    # Playwright functional tests
├── neoload/                # NeoLoad load test scenarios
└── .github/
    ├── workflows/          # CI/CD pipelines
    ├── copilot-instructions.md
    └── copilot-setup-steps.yml
```