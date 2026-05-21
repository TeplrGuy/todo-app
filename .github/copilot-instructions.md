# GitHub Copilot Instructions

This is a Tauri v2 todo application used to showcase GitHub Copilot's automated testing capabilities.

## Project Context
- Framework: Tauri v2 (Rust backend + React/TypeScript frontend)
- Storage: Browser localStorage
- Testing: Vitest (unit), Playwright (functional/e2e), NeoLoad (load testing)
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
- Place in e2e/ directory as *.spec.ts files
- Use Playwright for browser automation
- Follow AAA pattern (Arrange, Act, Assert)

When generating load tests:
- Place in neoload/ directory as *.yml files
- Follow NeoLoad scenario structure
- Define clear performance assertions
