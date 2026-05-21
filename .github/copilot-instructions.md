# GitHub Copilot Instructions

This is a Tauri v2 todo application used to showcase GitHub Copilot's automated testing capabilities.

## Project Context
- Framework: Tauri v2 (Rust backend + React/TypeScript frontend)
- Storage: Browser localStorage
- Testing: Vitest (unit), NeoLoad (functional + load testing)
- Token efficiency: Use caveman-style concise responses

## Code Style
- TypeScript strict mode
- React functional components with hooks
- Rust idiomatic code with proper error handling
- Test-driven development encouraged

## Testing Guidelines
When generating unit tests:
- Use Vitest + @testing-library/react for frontend
- Test each function/component in isolation
- Mock localStorage and Tauri API calls
- Aim for >80% coverage

When generating functional tests:
- Place in `neoload/functional/` as `*.yml` files
- Use NeoLoad YAML format: `name`, `variables`, `user_paths`, `populations`, `scenarios`
- Single virtual user (`duration.type: iteration, count: 1`)
- Include `assert` and `assert_not` steps to verify UI state
- Follow Arrange→Navigate→Act→Assert pattern

When generating load tests:
- Place in `neoload/scenarios/` as `*.yml` files
- Use NeoLoad YAML format with `rampup` and `constant` population blocks
- Define performance assertions: `avg_response_time`, `error_rate`, `percentile_95_response_time`
- Provide multiple scenarios: standard load, stress, soak

NeoLoad resources: https://www.tricentis.com/lp/neoload-performance-load-testing-ppc
