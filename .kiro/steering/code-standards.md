---
name: Code Standards
description: Code quality, structure, and professional patterns
type: global
inclusion: always
priority: critical
---

# Code Standards - Global Rules

## Core Principles

### Quality Over Quantity

**Rules:**
1. **Focused modules** - One clear purpose per file
2. **Efficient code** - Clean, performant, professional
3. **Clear intent** - Code should be self-documenting
4. **No "clever" code** - Readable > Short > Clever

### Professional Patterns Only

**Avoid:**
- Experimental approaches
- "Vibe coding" (exploratory without plan)
- Unstructured solutions
- Magic numbers/strings
- Overly complex abstractions

**Prefer:**
- Industry-standard patterns
- Well-tested approaches
- Clear, obvious solutions
- Named constants
- Simple, composable code

---

## File Length & Organization

### Smart File Sizing

**Not about arbitrary limits** - About clarity and focus

**Guidelines:**
```
Functions:
├─ Ideal: 10-30 lines
├─ Acceptable: Up to 50 lines
├─ Warning: 50-100 lines (consider splitting)
└─ Refactor: >100 lines (definitely split)

Files:
├─ Ideal: 100-200 lines
├─ Acceptable: Up to 300 lines
├─ Warning: 300-500 lines (consider splitting)
└─ Refactor: >500 lines (definitely split)
```

**When to split:**
- File has multiple responsibilities
- Hard to understand in 30 seconds
- Scrolling required to see full context
- Multiple developers editing same file
- Tests are getting complex

**When NOT to split:**
- Breaks logical cohesion
- Creates artificial boundaries
- Increases complexity
- Makes code harder to follow

**Rule**: If splitting makes code worse, don't split.

---

## Code Quality Checklist

### Before Writing Code

**Ask:**
1. What's the impact of this change?
2. Does this break anything?
3. Is this the cleanest approach?
4. What are the edge cases?
5. How will this be tested?

### While Writing Code

**Ensure:**
- Clear variable names (no `x`, `temp`, `data`)
- Obvious logic flow (no nested ternaries)
- No "magic" without comments
- Professional, not experimental
- Handles errors properly

### After Writing Code

**Verify:**
- Tests pass
- No type errors
- No linting issues
- Performance is acceptable
- Documentation is clear (if needed)

---

## Naming Conventions

### Variables & Functions

```typescript
// ✅ Good - Clear intent
const userAuthToken = getAuthToken();
const isUserAuthenticated = checkAuth();
const handleLoginSubmit = () => {};

// ❌ Bad - Unclear
const token = get();
const auth = check();
const handle = () => {};
```

### Files & Directories

```
// ✅ Good - Clear structure
src/
  components/
    Auth/
      LoginButton/
        LoginButton.tsx
        LoginButton.types.ts
        LoginButton.test.tsx
        index.ts

// ❌ Bad - Unclear
src/
  comp/
    auth/
      lb.tsx
      types.ts
```

### Constants

```typescript
// ✅ Good
const MAX_LOGIN_ATTEMPTS = 3;
const API_TIMEOUT_MS = 5000;
const DEFAULT_PAGE_SIZE = 20;

// ❌ Bad
const max = 3;
const timeout = 5000;
const size = 20;
```

---

## Function Design

### Single Responsibility

Each function should do ONE thing well.

```typescript
// ✅ Good - Single responsibility
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
  return password.length >= 8;
}

function validateLoginForm(email: string, password: string): ValidationResult {
  return {
    emailValid: validateEmail(email),
    passwordValid: validatePassword(password)
  };
}

// ❌ Bad - Multiple responsibilities
function validate(email: string, password: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  if (password.length < 8) return false;
  // Also checking user in database...
  // Also logging...
  // Also sending analytics...
  return true;
}
```

### Function Length

```typescript
// ✅ Good - Short and focused
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good - Longer but still clear
async function processOrder(order: Order): Promise<ProcessedOrder> {
  // Validate order
  const validation = validateOrder(order);
  if (!validation.valid) {
    throw new ValidationError(validation.errors);
  }

  // Calculate totals
  const subtotal = calculateSubtotal(order.items);
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  // Process payment
  const payment = await processPayment({
    amount: total,
    method: order.paymentMethod
  });

  // Create order record
  return createOrderRecord({
    ...order,
    subtotal,
    tax,
    total,
    paymentId: payment.id
  });
}

// ❌ Bad - Too long, doing too much
async function doEverything(data: any): Promise<any> {
  // 200+ lines of mixed concerns
  // Validation, calculation, API calls, database, logging, etc.
}
```

---

## Error Handling

### Always Handle Errors

```typescript
// ✅ Good - Proper error handling
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new UserNotFoundError(id);
    }
    logger.error('Failed to fetch user', { id, error });
    throw new ApiError('Unable to fetch user');
  }
}

// ❌ Bad - No error handling
async function fetchUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`);
  return response.data;
}
```

### Error Types

```typescript
// ✅ Good - Specific error types
class ValidationError extends Error {
  constructor(public fields: ValidationField[]) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

class UserNotFoundError extends Error {
  constructor(public userId: string) {
    super(`User ${userId} not found`);
    this.name = 'UserNotFoundError';
  }
}

// ❌ Bad - Generic errors
throw new Error('Something went wrong');
throw new Error('Error');
```

---

## Type Safety

### Use TypeScript Properly

```typescript
// ✅ Good - Proper types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

function getUser(id: string): Promise<User> {
  // Implementation
}

// ❌ Bad - Any types
function getUser(id: any): Promise<any> {
  // Implementation
}
```

### Avoid `any`

```typescript
// ✅ Good - Specific types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  // Implementation
}

// ❌ Bad - Using any
async function fetchData(url: string): Promise<any> {
  // Implementation
}
```

---

## Comments

### When to Comment

**Comment for WHY, not WHAT**

```typescript
// ✅ Good - Explains WHY
// Skip validation for admin users to allow bulk imports
if (user.role === 'admin') {
  return processWithoutValidation(data);
}

// Retry with exponential backoff due to rate limiting
const result = await retryWithBackoff(apiCall, { maxRetries: 3 });

// ❌ Bad - Explains WHAT (code already shows this)
// Increment counter by 1
counter++;

// Call the API
const result = await api.call();
```

### When NOT to Comment

```typescript
// ✅ Good - Self-documenting
const isUserAuthenticated = checkAuthStatus(user);
const hasValidSubscription = subscription.isActive && !subscription.isExpired;

// ❌ Bad - Unnecessary comments
// Check if user is authenticated
const auth = check(user);

// Check subscription
const sub = s.active && !s.expired;
```

### Complex Logic Comments

```typescript
// ✅ Good - Explains complex algorithm
/**
 * Calculate optimal batch size based on available memory and item size.
 * 
 * Uses a heuristic: batch_size = min(max_items, available_memory / (item_size * safety_factor))
 * Safety factor of 2 prevents memory exhaustion from overhead.
 * 
 * @param itemSize - Average size of each item in bytes
 * @param availableMemory - Available memory in bytes
 * @returns Optimal batch size
 */
function calculateBatchSize(itemSize: number, availableMemory: number): number {
  const SAFETY_FACTOR = 2;
  const MAX_BATCH_SIZE = 1000;
  
  const calculatedSize = Math.floor(
    availableMemory / (itemSize * SAFETY_FACTOR)
  );
  
  return Math.min(calculatedSize, MAX_BATCH_SIZE);
}
```

---

## Performance

### Optimize When Needed

**Don't prematurely optimize**

```typescript
// ✅ Good - Clear first, optimize if needed
function findUser(users: User[], id: string): User | undefined {
  return users.find(user => user.id === id);
}

// If profiling shows this is slow, THEN optimize:
function findUser(users: User[], id: string): User | undefined {
  // Use Map for O(1) lookup after profiling showed O(n) was bottleneck
  const userMap = new Map(users.map(u => [u.id, u]));
  return userMap.get(id);
}

// ❌ Bad - Premature optimization
function findUser(users: User[], id: string): User | undefined {
  // Complex caching, memoization, etc. before knowing if it's needed
}
```

### Measure Before Optimizing

**Process:**
1. Write clear, correct code
2. Profile to find bottlenecks
3. Optimize bottlenecks only
4. Measure improvement
5. Document why optimization was needed

---

## Testing

### Test Coverage

**What to test:**
- All business logic (100%)
- Public APIs (100%)
- Edge cases (critical paths)
- Error handling (critical paths)
- Integration points (key flows)

**What NOT to test:**
- Framework code
- Third-party libraries
- Trivial getters/setters
- Generated code

### Test Quality

```typescript
// ✅ Good - Clear, focused test
describe('calculateTotal', () => {
  it('sums item prices correctly', () => {
    const items = [
      { price: 10 },
      { price: 20 },
      { price: 30 }
    ];
    
    expect(calculateTotal(items)).toBe(60);
  });
  
  it('returns 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });
  
  it('handles negative prices', () => {
    const items = [{ price: -10 }];
    expect(calculateTotal(items)).toBe(-10);
  });
});

// ❌ Bad - Unclear, testing multiple things
it('works', () => {
  const items = [{ price: 10 }, { price: 20 }];
  expect(calculateTotal(items)).toBe(30);
  expect(calculateTotal([])).toBe(0);
  expect(items.length).toBe(2);
});
```

---

## Security

### Input Validation

```typescript
// ✅ Good - Validate all inputs
function createUser(data: CreateUserInput): User {
  // Validate
  const validation = validateUserInput(data);
  if (!validation.valid) {
    throw new ValidationError(validation.errors);
  }
  
  // Sanitize
  const sanitized = {
    email: sanitizeEmail(data.email),
    name: sanitizeString(data.name)
  };
  
  // Create
  return userRepository.create(sanitized);
}

// ❌ Bad - No validation
function createUser(data: any): User {
  return userRepository.create(data);
}
```

### SQL Injection Prevention

```typescript
// ✅ Good - Parameterized queries
async function getUser(id: string): Promise<User> {
  return db.query('SELECT * FROM users WHERE id = $1', [id]);
}

// ❌ Bad - String concatenation
async function getUser(id: string): Promise<User> {
  return db.query(`SELECT * FROM users WHERE id = '${id}'`);
}
```

### XSS Prevention

```typescript
// ✅ Good - Sanitize output
function displayUserName(name: string): string {
  return escapeHtml(name);
}

// ❌ Bad - Raw output
function displayUserName(name: string): string {
  return name; // Could contain <script> tags
}
```

---

## Code Review Checklist

### Before Submitting Code

**Verify:**
- [ ] Code follows naming conventions
- [ ] Functions are focused and clear
- [ ] Error handling is proper
- [ ] Types are specific (no `any`)
- [ ] Comments explain WHY, not WHAT
- [ ] Tests are comprehensive
- [ ] No security vulnerabilities
- [ ] Performance is acceptable
- [ ] No console.log or debug code
- [ ] Linting passes
- [ ] Build succeeds
- [ ] All tests pass

---

## Anti-Patterns to Avoid

### God Objects/Functions

```typescript
// ❌ Bad - Does everything
class UserManager {
  validateUser() {}
  authenticateUser() {}
  authorizeUser() {}
  createUser() {}
  updateUser() {}
  deleteUser() {}
  sendEmail() {}
  logActivity() {}
  generateReport() {}
  // ... 50 more methods
}

// ✅ Good - Focused responsibilities
class UserValidator {}
class UserAuthenticator {}
class UserRepository {}
class EmailService {}
class ActivityLogger {}
```

### Callback Hell

```typescript
// ❌ Bad - Nested callbacks
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      getMoreData(c, function(d) {
        // ...
      });
    });
  });
});

// ✅ Good - Async/await
async function processData() {
  const a = await getData();
  const b = await getMoreData(a);
  const c = await getMoreData(b);
  const d = await getMoreData(c);
  return d;
}
```

### Magic Numbers

```typescript
// ❌ Bad - Magic numbers
if (user.loginAttempts > 3) {
  lockAccount(user);
}

setTimeout(retry, 5000);

// ✅ Good - Named constants
const MAX_LOGIN_ATTEMPTS = 3;
const RETRY_DELAY_MS = 5000;

if (user.loginAttempts > MAX_LOGIN_ATTEMPTS) {
  lockAccount(user);
}

setTimeout(retry, RETRY_DELAY_MS);
```

---

## Key Principles Summary

1. **Clarity** - Code should be obvious
2. **Focus** - One responsibility per unit
3. **Efficiency** - Clean and performant
4. **Safety** - Handle errors, validate inputs
5. **Testability** - Easy to test
6. **Maintainability** - Easy to change
7. **Professional** - Industry-standard patterns

---

## When to Break Rules

**Only break these rules when:**
- Performance profiling shows clear need
- Framework/library requires different pattern
- Team has established different standard
- User explicitly requests different approach

**Always document why:**
```typescript
// Breaking naming convention due to external API requirement
// API expects 'usr_id' not 'userId'
const usr_id = user.id;
```
