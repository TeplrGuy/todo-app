# NeoLoad Integration

This directory contains NeoLoad performance test configurations for the Todo App.

## What is NeoLoad?

[NeoLoad](https://www.tricentis.com/lp/neoload-performance-load-testing-ppc) is a continuous performance testing platform by Tricentis designed for enterprise-scale load testing.

## Directory Structure

```
neoload/
├── README.md              # This file
└── scenarios/
    └── example-load-test.yml   # Example load test scenario
```

## Running Load Tests

Load tests are triggered via GitHub Issues with the `[LOAD TEST]` tag in the title or the `test-request` label. The `issue-test-triage.yml` workflow will automatically generate a NeoLoad scenario template.

To run NeoLoad tests manually:
1. Install the NeoLoad CLI: `pip install neoload`
2. Configure your NeoLoad workspace credentials
3. Run: `neoload run neoload/scenarios/<scenario>.yml`

## CI Integration

Load tests are proposed automatically when:
- A GitHub Issue is opened with `[LOAD TEST]` in the title
- A GitHub Issue is labeled with `test-request`

The auto-triage bot will comment with a proposed NeoLoad YAML scenario.
