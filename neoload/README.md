# NeoLoad Integration

This directory contains all NeoLoad test configurations for the Todo App — both **functional tests** and **load tests**.

🔗 [NeoLoad by Tricentis](https://www.tricentis.com/lp/neoload-performance-load-testing-ppc)

## What is NeoLoad?

[NeoLoad](https://www.tricentis.com/lp/neoload-performance-load-testing-ppc) is a continuous performance testing platform by Tricentis. In this project it is used as the **single test tool for both functional validation and load testing**.

| Test type | Virtual users | Duration | Location |
|-----------|--------------|----------|----------|
| Functional | 1 (iteration) | 1 run | `neoload/functional/` |
| Load | 30-200 (ramp and constant) | Minutes | `neoload/scenarios/` |

## Directory Structure

```
neoload/
├── README.md                         # This file
├── functional/
│   └── todo-functional.yml           # Functional smoke baseline (CI-safe)
└── scenarios/
  └── example-load-test.yml         # Load baselines (standard, stress, soak)
```

## Functional Tests (`neoload/functional/`)

Functional tests run as a **single virtual user**, one iteration. The repository baseline is intentionally minimal and NeoLoad as-code compatible so it validates and runs out of the box in CI.

### Validate YAML without credentials

```bash
pip install neoload
neoload validate neoload/functional/todo-functional.yml
```

### Run locally

```bash
# 1. Authenticate
neoload login --workspace "$NEOLOAD_WORKSPACE" "$NEOLOAD_TOKEN"

# 2. Upload project and configure test settings
neoload \
  test-settings \
    --zone defaultzone \
    --scenario "Functional Smoke Suite" \
    createorpatch todo-functional \
  project \
    --path neoload/functional/todo-functional.yml upload todo-functional

# 3. Run
neoload run todo-functional
```

### Validate first

```bash
neoload validate neoload/functional/todo-functional.yml
```

## Load Tests (`neoload/scenarios/`)

Three pre-built baseline scenarios target common load profiles:

| Scenario | Users | Duration | Goal |
|----------|-------|----------|------|
| Standard Load Test | 1 -> 50 (ramp 60s) + 300s constant | ~6 min | Baseline performance |
| Stress Test | 1 -> 200 (ramp 120s) + 180s constant | ~5 min | Find breaking point |
| Soak Test | 30 constant | 30 min | Detect memory leaks and degradation |

### Run locally

```bash
neoload login --workspace "$NEOLOAD_WORKSPACE" "$NEOLOAD_TOKEN"
neoload \
  test-settings --zone defaultzone --scenario "Standard Load Test" createorpatch todo-load \
  project --path neoload/scenarios/example-load-test.yml upload todo-load
neoload run todo-load
```

## CI Integration

### Functional tests (`functional-tests.yml`)

Triggered on every push to `src/` or `neoload/functional/`. The workflow:
1. Discovers all `*.yml` files in `neoload/functional/`
2. Validates each file with `neoload validate`
3. Runs via NeoLoad CLI **if** `NEOLOAD_TOKEN` secret is configured
4. Fails when no discovered test can run (all invalid or skipped)

### Issue-triggered triage for QA

Create GitHub issues with `[FUNCTIONAL TEST]`, `[LOAD TEST]`, or `[TEST]` in the title.

The `issue-test-triage.yml` workflow then:

1. Detects requested test type.
2. Checks for existing exact or similar NeoLoad test files.
3. Posts or updates one bot comment with NeoLoad-compatible baseline YAML.
4. Adds labels such as `tests-proposed` and `tests-existing` when relevant.

### Load tests (issue-triggered)

Opening a GitHub issue with `[LOAD TEST]` in the title causes the triage bot to post a NeoLoad-compatible baseline scaffold as a comment. Engineers implement and commit the scenario to `neoload/scenarios/`.

## Required Secrets

Add these in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `NEOLOAD_TOKEN` | NeoLoad API token |
| `NEOLOAD_WORKSPACE` | NeoLoad workspace ID |

