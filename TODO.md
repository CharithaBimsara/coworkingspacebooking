# Project Critical Issues Fix TODO

## Security & Vulnerabilities
- [x] Fix dependency vulnerabilities (update jsPDF and Vite)
- [x] Remove hardcoded credentials from networkManager.ts
- [x] Remove debug console statements from production code
- [x] Implement secure token storage with validation
- [x] Sanitize user-controlled content in v-html directives

## Configuration
- [x] Correct production environment configuration (.env.production)

## Code Quality
- [x] Fix failing unit tests
- [ ] Fix ESLint errors (49 issues)
- [x] Implement proper logging levels for dev/prod

## Steps to Execute
1. Update vulnerable dependencies
2. Clean up hardcoded secrets and debug logs
3. Improve token security
4. Add content sanitization
5. Fix environment configs
6. Resolve test failures
7. Address linting issues
8. Implement logging system