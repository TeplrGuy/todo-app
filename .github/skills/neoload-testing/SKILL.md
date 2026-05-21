---
name: neoload-testing
description: Create NeoLoad functional and load test YAML files that match this repository's conventions and CI guardrails.
---

# NeoLoad Testing Skill

Use this skill whenever QA or engineering requests NeoLoad functional tests (`neoload/functional/*.yml`) or load tests (`neoload/scenarios/*.yml`) through GitHub issues.

## Issue-First QA Flow

QA can request tests without direct code access by opening issues with one of these markers in the title:

* `[FUNCTIONAL TEST]`
* `[LOAD TEST]`
* `[TEST]`

The `issue-test-triage.yml` workflow auto-triages those issues and:

* Detects requested test type
* Checks whether matching or similar NeoLoad files already exist
* Posts or updates one bot comment with baseline YAML
* Adds labels:
  * `tests-proposed`
  * `tests-existing` when a likely duplicate already exists

## Repository Guardrails

- Functional tests go in `neoload/functional/` and must include top-level keys:
  - `name`
  - `variables`
  - `user_paths`
  - `populations`
  - `scenarios`
- Load tests go in `neoload/scenarios/` and must include:
  - realistic ramp/constant population blocks
  - scenario assertions such as `avg_response_time`, `error_rate`, and `percentile_95_response_time`
- Functional scenarios are smoke-style and should use single-iteration populations.
- In NeoLoad as-code YAML, use `actions.steps` directly under each user path.
- Do not use `actions.running`, `actions.init`, or `actions.end` in this repository.
- Start from a NeoLoad-compatible baseline (`think_time` step) and then expand.

## CI Compatibility Rules

* Functional workflow validates each discovered file using `neoload validate` before upload.
* If all discovered files are invalid or skipped, the workflow fails by design.
* Keep files both YAML-parseable and NeoLoad as-code compatible.
* Preserve discovery behavior for all `neoload/functional/*.yml` files.

## NeoLoad Baseline Templates

Use these as starting points because they validate with `neoload validate` out of the box.

### Functional baseline

```yaml
name: "Functional Smoke"
variables:
  - name: BASE_URL
    value: "http://localhost:1420"
user_paths:
  - name: "Functional Smoke"
    actions:
      steps:
        - think_time: 1s
populations:
  - name: "FunctionalUser"
    user_paths:
      - name: "Functional Smoke"
        distribution: 100%
scenarios:
  - name: "Functional Smoke"
    populations:
      - name: "FunctionalUser"
        duration:
          type: iteration
          count: 1
    assertions:
      - error_rate: "< 1%"
      - avg_response_time: "< 3s"
```

### Load baseline

```yaml
name: "Standard Load"
variables:
  - name: BASE_URL
    value: "http://localhost:1420"
user_paths:
  - name: "Load Path"
    actions:
      steps:
        - think_time: 1s
populations:
  - name: "Users"
    user_paths:
      - name: "Load Path"
        distribution: 100%
scenarios:
  - name: "Standard Load"
    populations:
      - name: "Users"
        rampup:
          duration: 60s
          start_users: 1
          end_users: 50
        constant:
          users: 50
          duration: 300s
    assertions:
      - avg_response_time: "< 2s"
      - error_rate: "< 1%"
```

## Duplicate Detection Rules

Before creating a new test YAML:

* Check exact slug path match in the expected folder
* Check similar filenames sharing the same core tokens
* Reuse existing test files when intent overlaps
* Create a new file only when scope, SLA, or data profile differs clearly

## Authoring Checklist

1. Place file in the correct folder:
   - Functional: `neoload/functional/<name>.yml`
   - Load: `neoload/scenarios/<name>.yml`
2. Keep YAML indentation and quoting consistent with existing files.
3. Add/keep meaningful variable names and deterministic test data.
4. Ensure each user path has `actions.steps` with at least one valid step.
5. Ensure each scenario references declared populations.
6. For load tests, include standard, stress, and soak scenarios when requested.
7. Validate YAML locally before PR:
   - `neoload validate neoload/functional/<file>.yml`
   - `neoload validate neoload/scenarios/<file>.yml`
8. Run repository checks after edits (`npm run build`, `npm test`, and targeted workflow checks).
