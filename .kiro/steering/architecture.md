---
name: Architecture
description: File structure, organization, and strict separation rules
type: global
inclusion: always
priority: critical
---

# Architecture - Global Rules

## Core Principle

**Strict Separation of Concerns**

Every file has ONE clear purpose. Every directory has ONE clear responsibility.

---

## File Structure Standard (Option A)

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

**Anti-pattern (Never do this):**
```
// ❌ Bad - Everything in one file
Button.tsx
  ├─ Component logic
  ├─ Type definitions
  ├─ Styles (CSS-in-JS)
  ├─ Tests
  └─ Helper functions
```

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
│   ├── fixtures/                # Test data
│   ├── mocks/                   # Mock implementations
│   └── utils/                   # Test utilities
│
├── docs/                        # Documentation
├── scripts/                     # Build & utility scripts
└── public/                      # Public static files
```

### Component Directory

```
src/components/
├── Auth/                        # Auth-related components
│   ├── LoginButton/
│   │   ├── LoginButton.tsx
│   │   ├── LoginButton.types.ts
│   │   ├── LoginButton.test.tsx
│   │   └── index.ts
│   │
│   ├── LogoutButton/
│   │   ├── LogoutButton.tsx
│   │   ├── LogoutButton.types.ts
│   │   ├── LogoutButton.test.tsx
│   │   └── index.ts
│   │
│   └── index.ts                 # Export all Auth components
│
├── Form/                        # Form-related components
│   ├── Input/
│   ├── Select/
│   ├── Checkbox/
│   └── index.ts
│
└── Layout/                      # Layout components
    ├── Header/
    ├── Footer/
    ├── Sidebar/
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
│   ├── ApiClient.ts             # API client
│   ├── ApiClient.types.ts       # API types
│   ├── ApiClient.test.ts        # API tests
│   └── index.ts
│
└── storage/
    ├── StorageService.ts
    ├── StorageService.types.ts
    ├── StorageService.test.ts
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

## Import Organization

### Import Order

**Always follow this order:**

```typescript
// 1. External dependencies (React, libraries)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 2. Internal absolute imports (from src/)
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/services/auth';

// 3. Relative imports (from current directory)
import { LoginForm } from './LoginForm';
import { validateCredentials } from './utils';

// 4. Type imports
import type { User } from '@/types/User';
import type { LoginFormProps } from './LoginForm.types';

// 5. Styles
import styles from './LoginPage.module.css';
```

### Import Grouping

```typescript
// ✅ Good - Grouped and ordered
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

import { LoginForm } from './LoginForm';

import type { User } from '@/types/User';

import styles from './LoginPage.module.css';

// ❌ Bad - Random order
import styles from './LoginPage.module.css';
import { Button } from '@/components/Button';
import React from 'react';
import type { User } from '@/types/User';
import { LoginForm } from './LoginForm';
```

---

## File Content Structure

### Component File Structure

```typescript
// 1. Imports (ordered as above)
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import type { LoginButtonProps } from './LoginButton.types';
import styles from './LoginButton.module.css';

// 2. Constants (if needed)
const MAX_RETRIES = 3;
const BUTTON_TEXT = 'Login';

// 3. Helper functions (if small and specific to this component)
function validateInput(value: string): boolean {
  return value.length > 0;
}

// 4. Main component
export function LoginButton({
  onClick,
  disabled = false,
  className = ''
}: LoginButtonProps) {
  // 4a. Hooks
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // 4b. Event handlers
  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 4c. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 4d. Render
  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`${styles.loginButton} ${className}`}
    >
      {isLoading ? 'Loading...' : BUTTON_TEXT}
    </Button>
  );
}

// 5. Default export (if needed)
export default LoginButton;
```

### Service File Structure

```typescript
// 1. Imports
import axios from 'axios';
import type { User, LoginCredentials } from './AuthService.types';

// 2. Constants
const API_BASE_URL = process.env.REACT_APP_API_URL;
const TOKEN_KEY = 'auth_token';

// 3. Class or functions
export class AuthService {
  // 3a. Private properties
  private static instance: AuthService;
  private token: string | null = null;
  
  // 3b. Constructor
  private constructor() {
    this.token = localStorage.getItem(TOKEN_KEY);
  }
  
  // 3c. Public static methods
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  
  // 3d. Public methods
  public async login(credentials: LoginCredentials): Promise<User> {
    // Implementation
  }
  
  public async logout(): Promise<void> {
    // Implementation
  }
  
  // 3e. Private methods
  private async refreshToken(): Promise<string> {
    // Implementation
  }
}

// 4. Export singleton instance (if applicable)
export const authService = AuthService.getInstance();
```

---

## Type Definition Files

### Types File Structure

```typescript
// [ComponentName].types.ts

// 1. Imports (if needed)
import type { ReactNode } from 'react';

// 2. Enums
export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Danger = 'danger'
}

// 3. Type aliases
export type ButtonSize = 'small' | 'medium' | 'large';

// 4. Interfaces (props, state, etc.)
export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface ButtonState {
  isPressed: boolean;
  isFocused: boolean;
}

// 5. Complex types
export type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;

// 6. Utility types (if needed)
export type ButtonPropsWithoutChildren = Omit<ButtonProps, 'children'>;
```

---

## Test File Structure

```typescript
// [ComponentName].test.tsx

// 1. Imports
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import type { ButtonProps } from './Button.types';

// 2. Test utilities
const defaultProps: ButtonProps = {
  children: 'Click me',
  onClick: jest.fn()
};

function renderButton(props: Partial<ButtonProps> = {}) {
  return render(<Button {...defaultProps} {...props} />);
}

// 3. Test suites
describe('Button', () => {
  // 3a. Setup/teardown
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // 3b. Rendering tests
  describe('Rendering', () => {
    it('renders with text', () => {
      renderButton();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });
    
    it('applies custom className', () => {
      renderButton({ className: 'custom' });
      expect(screen.getByRole('button')).toHaveClass('custom');
    });
  });
  
  // 3c. Behavior tests
  describe('Behavior', () => {
    it('calls onClick when clicked', () => {
      const onClick = jest.fn();
      renderButton({ onClick });
      
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
    
    it('does not call onClick when disabled', () => {
      const onClick = jest.fn();
      renderButton({ onClick, disabled: true });
      
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });
  
  // 3d. State tests
  describe('States', () => {
    it('shows loading state', () => {
      renderButton({ loading: true });
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});
```

---

## Index Files (Barrel Exports)

### Component Index

```typescript
// src/components/Button/index.ts

// ✅ Good - Named exports
export { Button } from './Button';
export type { ButtonProps, ButtonVariant } from './Button.types';

// ❌ Bad - Default export
export { default } from './Button';

// ❌ Bad - Re-exporting everything
export * from './Button';
```

### Directory Index

```typescript
// src/components/Auth/index.ts

// ✅ Good - Explicit exports
export { LoginButton } from './LoginButton';
export { LogoutButton } from './LogoutButton';
export { SignupButton } from './SignupButton';

export type { LoginButtonProps } from './LoginButton';
export type { LogoutButtonProps } from './LogoutButton';
export type { SignupButtonProps } from './SignupButton';

// ❌ Bad - Wildcard exports
export * from './LoginButton';
export * from './LogoutButton';
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

## Key Architecture Principles

1. **Strict Separation** - One file, one purpose
2. **Clear Boundaries** - Modules have defined responsibilities
3. **Consistent Structure** - Same pattern everywhere
4. **Explicit Exports** - No wildcard exports
5. **Type Safety** - Separate .types.ts files
6. **Testability** - Separate .test.ts files
7. **Scalability** - Pattern works at any size

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
