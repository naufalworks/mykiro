---
name: Architecture Overview
description: Core principles, file naming conventions, and directory structure
type: global
inclusion: always
priority: critical
version: 2.0
lastUpdated: 2026-05-03
---

# Architecture - Overview

## Core Principle

**Strict Separation of Concerns**

Every file has ONE clear purpose. Every directory has ONE clear responsibility.

---

## File Structure Standard

### Component Structure

**Strict separation - Always follow this pattern:**

```
src/
  components/
    [ComponentName]/
      [ComponentName].tsx          # Component logic only
      [ComponentName].types.ts     # Type definitions only
      [ComponentName].test.tsx     # Tests only
      [ComponentName].styles.css   # Styles only (if needed)
      index.ts                     # Exports only
```

**Example:**
```
src/
  components/
    Button/
      Button.tsx                   # Button component
      Button.types.ts              # ButtonProps, ButtonVariant, etc.
      Button.test.tsx              # Button tests
      Button.module.css            # Button styles
      index.ts                     # export { Button } from './Button'
```

### Why Strict Separation?

**Benefits:**
1. **Clear responsibility** - Each file has one job
2. **Easy to find** - Know exactly where to look
3. **Better collaboration** - No merge conflicts
4. **Easier testing** - Tests are isolated
5. **Better tooling** - IDEs work better
6. **Scalability** - Pattern works for any size

---

## Directory Structure

### Root Structure

```
project-root/
├── src/                         # Source code
│   ├── components/              # Reusable UI components
│   ├── pages/                   # Page-level components
│   ├── features/                # Feature-specific modules
│   ├── services/                # Business logic & API calls
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Utility functions
│   ├── types/                   # Shared type definitions
│   ├── constants/               # Constants & enums
│   ├── config/                  # Configuration files
│   ├── styles/                  # Global styles
│   └── assets/                  # Static assets
│
├── tests/                       # Test utilities & fixtures
├── docs/                        # Documentation
├── scripts/                     # Build & utility scripts
└── public/                      # Public static files
```

### Component Directory

```
src/components/
├── Auth/                        # Auth-related components
│   ├── LoginButton/
│   ├── LogoutButton/
│   └── index.ts                 # Export all Auth components
│
├── Form/                        # Form-related components
│   ├── Input/
│   ├── Select/
│   └── index.ts
│
└── Layout/                      # Layout components
    ├── Header/
    ├── Footer/
    └── index.ts
```

### Service Directory

```
src/services/
├── auth/
│   ├── AuthService.ts           # Auth business logic
│   ├── AuthService.types.ts     # Auth types
│   ├── AuthService.test.ts      # Auth tests
│   └── index.ts                 # Exports
│
├── api/
│   ├── ApiClient.ts
│   ├── ApiClient.types.ts
│   └── index.ts
│
└── storage/
    ├── StorageService.ts
    ├── StorageService.types.ts
    └── index.ts
```

---

## File Naming Conventions

### Components

```
PascalCase for components:
✅ Button.tsx
✅ LoginButton.tsx
✅ UserProfileCard.tsx

❌ button.tsx
❌ loginButton.tsx
❌ user-profile-card.tsx
```

### Services & Utilities

```
PascalCase for classes/services:
✅ AuthService.ts
✅ ApiClient.ts
✅ StorageService.ts

camelCase for utilities:
✅ formatDate.ts
✅ validateEmail.ts
✅ parseUrl.ts
```

### Types

```
Always .types.ts suffix:
✅ Button.types.ts
✅ AuthService.types.ts
✅ api.types.ts

❌ ButtonTypes.ts
❌ types.ts (too generic)
❌ Button.d.ts (use .types.ts)
```

### Tests

```
Always .test.ts or .spec.ts suffix:
✅ Button.test.tsx
✅ AuthService.test.ts
✅ formatDate.spec.ts

❌ Button.tests.tsx
❌ test-Button.tsx
❌ ButtonTest.tsx
```

### Styles

```
Module CSS (preferred):
✅ Button.module.css
✅ LoginForm.module.css

Regular CSS:
✅ global.css
✅ variables.css
✅ reset.css

❌ button.css (not module)
❌ styles.css (too generic)
```

---

## Module Boundaries

### Clear Separation

```
components/     → UI components only
├─ No business logic
├─ No API calls
├─ No direct state management
└─ Props in, JSX out

services/       → Business logic only
├─ No UI components
├─ No JSX
├─ API calls allowed
└─ Pure TypeScript/JavaScript

hooks/          → React hooks only
├─ Reusable logic
├─ No UI components
├─ Can use services
└─ Return values, not JSX

utils/          → Pure functions only
├─ No side effects
├─ No state
├─ No API calls
└─ Input → Output

types/          → Type definitions only
├─ No implementation
├─ No logic
└─ Types and interfaces only
```

### Cross-Module Dependencies

```
✅ Allowed:
components → hooks
components → utils
components → types
services → utils
services → types
hooks → services
hooks → utils
hooks → types

❌ Not Allowed:
services → components
utils → components
utils → hooks
types → anything (types are leaf nodes)
```

---

## File Size Guidelines

### When to Split

**Component files:**
```
< 100 lines: Perfect
100-200 lines: Good
200-300 lines: Consider splitting
> 300 lines: Definitely split
```

**Service files:**
```
< 200 lines: Perfect
200-400 lines: Good
400-600 lines: Consider splitting
> 600 lines: Definitely split
```

**How to split:**
```
Large component:
├─ Extract sub-components
├─ Move logic to hooks
├─ Move helpers to utils
└─ Split into feature modules

Large service:
├─ Split by responsibility
├─ Extract helper functions
├─ Create separate services
└─ Use composition
```

---

## Path Aliases

### Configure Path Aliases

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

### Use Aliases Consistently

```typescript
// ✅ Good - Using aliases
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/formatDate';

// ❌ Bad - Relative paths from root
import { Button } from '../../../components/Button';
import { useAuth } from '../../hooks/useAuth';
```

---

## Key Architecture Principles

1. **Strict Separation** - One file, one purpose
2. **Clear Boundaries** - Modules have defined responsibilities
3. **Consistent Structure** - Same pattern everywhere
4. **Explicit Exports** - No wildcard exports
5. **Type Safety** - Separate .types.ts files
6. **Testability** - Separate .test.ts files
7. **Scalability** - Pattern works at any size

---

## Architecture Checklist

### Before Creating New File

- [ ] Does it follow naming convention?
- [ ] Is it in the correct directory?
- [ ] Does it have ONE clear purpose?
- [ ] Is the file name descriptive?
- [ ] Will it have a corresponding .types.ts file?
- [ ] Will it have a corresponding .test.ts file?
- [ ] Does it follow the structure pattern?

### Before Creating New Directory

- [ ] Does it represent a clear module?
- [ ] Is it at the right level?
- [ ] Does it follow naming convention?
- [ ] Will it have an index.ts?
- [ ] Does it fit the overall architecture?

---

## For Detailed Information

- **Component patterns**: See #architecture-components.md
- **Advanced patterns**: See #architecture-advanced.md
- **Code standards**: See #code-standards.md

---

## When to Break Rules

**Only break these rules when:**
- Framework requires different structure
- Third-party library has specific requirements
- Team has established different standard
- User explicitly requests different approach

**Always document why:**
```typescript
// Breaking architecture rule: combining types in component file
// Reason: This is a one-off utility component with only 2 types
// that are never used elsewhere
```

