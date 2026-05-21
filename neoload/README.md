# NeoLoad Integration

This directory contains all NeoLoad test configurations for the Todo App — both **functional tests** and **load tests**.

🔗 [NeoLoad by Tricentis](https://www.tricentis.com/lp/neoload-performance-load-testing-ppc)

## What is NeoLoad?

[NeoLoad](https://www.tricentis.com/lp/neoload-performance-load-testing-ppc) is a continuous performance testing platform by Tricentis. In this project it is used as the **single test tool for both functional validation and load testing**.

| Test type | Virtual users | Duration | Location |
|-----------|--------------|----------|----------|
| Functional | 1 (iteration) | 1 run | `neoload/functional/` |
| Load | 50–200 (ramp-up) | Minutes | `neoload/scenarios/` |

## Directory Structure

```
neoload/
├── README.md                         # This file
├── functional/
│   └── todo-functional.yml           # Functional smoke suite (8 user paths)
└── scenarios/
    └── example-load-test.yml         # Load test (standard · stress · soak)
```

## Functional Tests (`neoload/functional/`)

Functional tests run as a **single virtual user**, one iteration. They validate correctness — each user path mirrors a feature scenario:

1. App Header Check
2. Add Todo
3. Toggle Todo Completion
4. Delete Todo
5. Edit Todo
6. Filter Todos (Active/Completed tabs)
7. Clear Completed
8. Stats Counter

### Run locally

```bash
pip install neoload
neoload --token $NEOLOAD_TOKEN --workspace $NEOLOAD_WORKSPACE \
  run neoload/functional/todo-functional.yml
```

### Validate YAML without credentials

```bash
python -c "
import yaml, sys
doc = yaml.safe_load(open('neoload/functional/todo-functional.yml'))
required = ['name', 'user_paths', 'scenarios']
missing = [k for k in required if k not in doc]
print('FAIL:', missing) if missing else print('OK')
"
```

## Load Tests (`neoload/scenarios/`)

Three pre-built scenarios targeting different load profiles:

| Scenario | Users | Duration | Goal |
|----------|-------|----------|------|
| Load Test | 1 → 50 (ramp 60s) + 300s constant | ~6 min | Baseline performance |
| Stress Test | 1 → 200 (ramp 120s) + 180s constant | ~5 min | Find breaking point |
| Soak Test | 30 constant | 30 min | Detect memory leaks / degradation |

### Run locally

```bash
neoload --token $NEOLOAD_TOKEN --workspace $NEOLOAD_WORKSPACE \
  run neoload/scenarios/example-load-test.yml
```

## CI Integration

### Functional tests (`functional-tests.yml`)

Triggered on every push to `src/` or `neoload/functional/`. The workflow:
1. Discovers all `*.yml` files in `neoload/functional/`
2. Validates YAML structure (no credentials needed)
3. Runs via NeoLoad CLI **if** `NEOLOAD_TOKEN` secret is configured

### Load tests (issue-triggered)

Opening a GitHub Issue with `[LOAD TEST]` in the title causes the triage bot to post a NeoLoad YAML scenario scaffold as a comment. Engineers implement and commit the scenario to `neoload/scenarios/`.

## Required Secrets

Add these in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `NEOLOAD_TOKEN` | NeoLoad API token |
| `NEOLOAD_WORKSPACE` | NeoLoad workspace ID |

