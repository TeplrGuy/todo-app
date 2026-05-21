# Todo App — Tauri v2 + React/TypeScript

A full-featured desktop Todo application built with Tauri v2 and React/TypeScript, showcasing GitHub Copilot's automated testing capabilities across three layers: unit tests, NeoLoad functional tests, and NeoLoad load tests.

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
- **Storage**: Browser `localStorage` (seed data pre-populated)
- **Testing**: Vitest (unit) · NeoLoad (functional + load)

## Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [Rust](https://rustup.rs/) (stable)
- [Tauri CLI prerequisites](https://tauri.app/start/prerequisites/)
- [NeoLoad CLI](https://docs.neotys.com/test-execution/latest/cli) (`pip install neoload`) for functional/load tests

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

# Validate NeoLoad functional test YAML (no credentials needed)
python -c "import yaml; yaml.safe_load(open('neoload/functional/todo-functional.yml'))"

# Run NeoLoad functional tests (requires NeoLoad account)
neoload --token $NEOLOAD_TOKEN --workspace $NEOLOAD_WORKSPACE \
  run neoload/functional/todo-functional.yml

# Run NeoLoad load tests (requires NeoLoad account)
neoload --token $NEOLOAD_TOKEN --workspace $NEOLOAD_WORKSPACE \
  run neoload/scenarios/example-load-test.yml
```

## Testing Strategy

| Layer | Tool | Location |
|-------|------|----------|
| Unit | Vitest + Testing Library | `src/__tests__/` |
| Functional | NeoLoad (1 virtual user) | `neoload/functional/` |
| Load | NeoLoad (50–200 virtual users) | `neoload/scenarios/` |
| Rust | `cargo test` | `src-tauri/src/lib.rs` |

### NeoLoad Functional vs Load Tests

**Functional tests** (`neoload/functional/`) validate correctness — single virtual user, iteration-based, assert UI state after each action.

**Load tests** (`neoload/scenarios/`) validate performance — ramp-up to 50–200 users, sustained duration, assert response times and error rates. Three pre-built scenarios: standard load, stress, and soak.

## GitHub Actions Workflows

| Workflow | Trigger | Description |
|----------|---------|-------------|
| `ci.yml` | push/PR to main | Runs frontend + Rust unit tests, build check |
| `functional-tests.yml` | push to src/ or neoload/functional/ | Auto-discovers `*.yml` in `neoload/functional/`, validates YAML, runs via NeoLoad CLI if `NEOLOAD_TOKEN` secret is set |
| `issue-test-triage.yml` | Issue opened/labeled | Proposes NeoLoad YAML scaffolding for `[FUNCTIONAL TEST]` and `[LOAD TEST]` issues |

### Required Secrets (for live test runs)

| Secret | Description |
|--------|-------------|
| `NEOLOAD_TOKEN` | NeoLoad API token |
| `NEOLOAD_WORKSPACE` | NeoLoad workspace ID |

## GitHub Copilot Features

This repo demonstrates Copilot's testing capabilities:

- **Unit test generation** — Copilot generates Vitest tests for hooks, utils, and components
- **Functional test discovery** — CI auto-discovers any `*.yml` added to `neoload/functional/` (no workflow changes needed)
- **Issue-triggered triage** — Opening a `[LOAD TEST]` or `[FUNCTIONAL TEST]` issue triggers the bot to scaffold NeoLoad YAML

See `.github/copilot-instructions.md` for Copilot context configuration.

## NeoLoad Integration

Performance and functional tests live under `neoload/`. See [`neoload/README.md`](neoload/README.md) for setup and CLI details.

🔗 [NeoLoad by Tricentis](https://www.tricentis.com/lp/neoload-performance-load-testing-ppc)

## Project Structure

```
todo-app/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions (incl. seed data)
│   └── __tests__/          # Unit tests
├── src-tauri/              # Rust/Tauri backend
│   └── src/
│       ├── main.rs
│       └── lib.rs          # Commands + tests
├── neoload/
│   ├── functional/         # NeoLoad functional tests (1 user)
│   └── scenarios/          # NeoLoad load test scenarios
└── .github/
    ├── workflows/          # CI/CD pipelines
    ├── copilot-instructions.md
    └── copilot-setup-steps.yml
```