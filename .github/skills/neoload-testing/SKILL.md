---
name: neoload-testing
description: Create NeoLoad functional and load test YAML files that match this repository's conventions and CI guardrails.
---

# NeoLoad Testing Skill

Use this skill whenever an issue asks for new NeoLoad functional tests (`neoload/functional/*.yml`) or load/performance tests (`neoload/scenarios/*.yml`).

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
- Follow Arrange → Navigate → Act → Assert flow in each functional user path.
- Use concise, stable selectors and explicit `assert` / `assert_not` checks for expected UI state.

## CI Compatibility Rules

- The functional workflow validates discovered files for YAML syntax + required top-level structure before optional live runs.
- Do not rely on NeoLoad as-code schema validation for browser-style functional YAML in this repository.
- Keep new files parseable by `yaml.safe_load` and keep required top-level sections present.
- Preserve existing workflow behavior: discovery of all `neoload/functional/*.yml` files and optional live execution only when secrets are set.

## Authoring Checklist

1. Place file in the correct folder:
   - Functional: `neoload/functional/<name>.yml`
   - Load: `neoload/scenarios/<name>.yml`
2. Keep YAML indentation and quoting consistent with existing files.
3. Add/keep meaningful variable names and deterministic test data.
4. Ensure each scenario references declared populations.
5. For load tests, include standard, stress, and soak scenarios when requested.
6. Run available repository checks after edits (`npm run build`, `npm test`, and targeted workflow-related checks).
