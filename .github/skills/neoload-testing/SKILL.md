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

- Functional tests → `neoload/functional/`, load tests → `neoload/scenarios/`
- Every file **must** pass `neoload validate` locally before PR (enforced by CI)
- Target URL: `https://green-wave-0693f8c0f.7.azurestaticapps.net` (Azure SWA, publicly reachable by NeoLoad SaaS agents)

### NeoLoad SaaS Schema — Critical Rules (validated against `as-code.latest.schema.json`)

These rules apply to **both** local `neoload validate` AND NeoLoad SaaS server-side upload. Violating them causes `PARSING_INVALID_AS_CODE_FILE` on upload even if local validation passes.

| Rule | ✅ Correct | ❌ Wrong |
|---|---|---|
| `servers` block required | `servers: [{name, host, port, scheme}]` | omitting `servers` |
| `request` step is an object | `- request: {url: /, server: todo_app}` | `- request: /` |
| Scenario population load | `rampup_load: {min_users, max_users, increment_users, increment_every, duration}` | `constant_load:` (avoid — server compatibility unclear), `rampup:`, `constant:`, `duration: {type: iteration}` |
| Duration format | `"5m"`, `"30s"`, `"1 iterations"` (string) | `{type: iteration, count: 1}` (object) |
| `populations[].user_paths[]` | `- name: "Path Name"` only | adding `distribution: 100%` |
| `scenarios[]` properties | `name`, `description`, `populations` only | `assertions:` — not in schema |

## CI Compatibility Rules

- Functional workflow validates each file with `neoload validate` then uploads to NeoLoad SaaS
- If all files are invalid or upload fails, workflow fails by design
- Local `neoload validate` uses JSON Schema (Draft 7) which is lenient on extra properties; the SaaS server parser is strict — follow the table above exactly

## NeoLoad Baseline Templates

Copy these verbatim — they pass both `neoload validate` and NeoLoad SaaS upload.

### Functional baseline

```yaml
name: "Functional Smoke"
servers:
  - name: todo_app
    host: green-wave-0693f8c0f.7.azurestaticapps.net
    port: 443
    scheme: https
variables:
  - name: BASE_URL
    value: "https://green-wave-0693f8c0f.7.azurestaticapps.net"
user_paths:
  - name: "Functional Smoke"
    actions:
      steps:
        - request:
            url: /
            server: todo_app
        - think_time: 1s
populations:
  - name: "FunctionalUser"
    user_paths:
      - name: "Functional Smoke"
scenarios:
  - name: "Functional Smoke"
    populations:
      - name: "FunctionalUser"
        rampup_load:
          min_users: 1
          max_users: 1
          increment_users: 1
          increment_every: 1s
          duration: "30s"
```

### Load baseline

```yaml
name: "Standard Load"
servers:
  - name: todo_app
    host: green-wave-0693f8c0f.7.azurestaticapps.net
    port: 443
    scheme: https
variables:
  - name: BASE_URL
    value: "https://green-wave-0693f8c0f.7.azurestaticapps.net"
user_paths:
  - name: "Load Path"
    actions:
      steps:
        - request:
            url: /
            server: todo_app
        - think_time: 1s
populations:
  - name: "Users"
    user_paths:
      - name: "Load Path"
scenarios:
  - name: "Standard Load"
    populations:
      - name: "Users"
        rampup_load:
          min_users: 1
          max_users: 50
          increment_users: 5
          increment_every: 10s
          duration: "5m"
```

## Duplicate Detection Rules

Before creating a new test YAML:

* Check exact slug path match in the expected folder
* Check similar filenames sharing the same core tokens
* Reuse existing test files when intent overlaps
* Create a new file only when scope, SLA, or data profile differs clearly

## Authoring Checklist

1. Copy the correct baseline template above verbatim — do not invent new schema keys.
2. Place in the correct folder: `neoload/functional/` or `neoload/scenarios/`.
3. Name the file with a slug matching the feature under test.
4. Set `server: todo_app` inside each `request` step (references the `servers` block).
5. Use `constant_load` or `rampup_load` inside scenario populations — never bare `duration:` or `assertions:`.
6. Use duration as a string: `"5m"`, `"30s"`, or `"1 iterations"` — never an object.
7. Validate locally before PR: `neoload validate neoload/functional/<file>.yml`
8. If validation passes locally but CI upload fails with `PARSING_INVALID_AS_CODE_FILE`, re-check the schema rules table above — the SaaS server is stricter than the local validator.
