# Personal Coding Preferences

## General Philosophy
- Write clean, readable code over clever code
- Prefer composition over inheritance
- Keep functions small and focused
- Document the "why", not the "what"

## Language Preferences

### TypeScript/JavaScript
- Always use TypeScript for new projects
- Prefer `const` over `let`, avoid `var`
- Use async/await over promises chains
- Prefer functional programming patterns

### Naming Conventions
- Variables/Functions: `camelCase`
- Classes/Components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: Match the export (PascalCase for components, camelCase for utilities)

## Code Style

### Functions
```typescript
// ✅ Prefer arrow functions for simple operations
const add = (a: number, b: number) => a + b;

// ✅ Use function declarations for complex logic
function processUserData(user: User): ProcessedUser {
  // Complex logic here
}
```

### Error Handling
```typescript
// Always use try-catch for async operations
async function fetchData() {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch data', error);
    throw new DataFetchError('Unable to retrieve data');
  }
}
```

### Comments
- Write comments for WHY, not WHAT
- Document complex algorithms
- Add JSDoc for public APIs
- Avoid obvious comments

```typescript
// ❌ Bad - obvious
// Increment counter by 1
counter++;

// ✅ Good - explains why
// Skip validation for admin users to allow bulk imports
if (user.role === 'admin') {
  return processWithoutValidation(data);
}
```

## Testing Preferences
- Write tests for all business logic
- Test behavior, not implementation
- Keep tests simple and readable
- Use descriptive test names

## Git Workflow
- Write clear, descriptive commit messages
- Use conventional commits format: `feat:`, `fix:`, `docs:`, etc.
- Keep commits atomic and focused
- Squash WIP commits before merging

## Code Review Standards
- Be constructive and respectful
- Focus on logic and maintainability
- Suggest improvements, don't demand
- Approve if it works, even if you'd do it differently

## Performance
- Optimize only when needed (measure first)
- Prefer readability over premature optimization
- Use memoization for expensive computations
- Lazy load heavy components

## Accessibility
- Always use semantic HTML
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers for critical flows

## Security
- Never commit secrets or API keys
- Validate all user input
- Use parameterized queries for databases
- Keep dependencies updated

## Documentation
- README for every project
- API documentation for public endpoints
- Architecture decisions in ADR format
- Keep documentation close to code
