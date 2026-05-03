---
name: Architecture Components
description: Component patterns, import organization, and file content structure
type: global
inclusion: fileMatch
fileMatchPattern: "**/components/**"
priority: high
version: 2.0
lastUpdated: 2026-05-03
---

# Architecture - Component Patterns

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

## Component File Structure

### Standard Component Structure

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

---

## Service File Structure

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

## Component Patterns

### Functional Components (Preferred)

```typescript
// ✅ Good - Named function export
export function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// ✅ Good - Arrow function with explicit type
export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};

// ❌ Bad - Default export
export default function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

### Props Destructuring

```typescript
// ✅ Good - Destructure in parameters
export function Button({ 
  children, 
  variant = 'primary',
  disabled = false,
  onClick 
}: ButtonProps) {
  // Use directly
}

// ❌ Bad - Destructure in body
export function Button(props: ButtonProps) {
  const { children, variant, disabled, onClick } = props;
  // Extra step
}
```

### Conditional Rendering

```typescript
// ✅ Good - Early return
export function Button({ children, hidden }: ButtonProps) {
  if (hidden) return null;
  
  return <button>{children}</button>;
}

// ✅ Good - Ternary for simple cases
export function Button({ loading, children }: ButtonProps) {
  return <button>{loading ? 'Loading...' : children}</button>;
}

// ❌ Bad - Nested ternaries
export function Button({ state, children }: ButtonProps) {
  return (
    <button>
      {state === 'loading' ? 'Loading...' : state === 'error' ? 'Error' : children}
    </button>
  );
}
```

---

## Hooks Usage

### Hook Order

```typescript
export function Component() {
  // 1. State hooks
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  
  // 2. Context hooks
  const theme = useContext(ThemeContext);
  
  // 3. Ref hooks
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 4. Custom hooks
  const { user, logout } = useAuth();
  
  // 5. Effect hooks
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 6. Callback/memo hooks
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  const memoizedValue = useMemo(() => {
    return expensiveCalculation(count);
  }, [count]);
  
  // 7. Event handlers (non-memoized)
  const handleSubmit = () => {
    // Handler logic
  };
  
  // 8. Render
  return <div>...</div>;
}
```

---

## Event Handlers

### Naming Convention

```typescript
// ✅ Good - handle prefix
const handleClick = () => {};
const handleSubmit = () => {};
const handleChange = () => {};

// ❌ Bad - inconsistent naming
const onClick = () => {};
const submitForm = () => {};
const changeHandler = () => {};
```

### Async Handlers

```typescript
// ✅ Good - Proper error handling
const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await api.submit(data);
    setSuccess(true);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

// ❌ Bad - No error handling
const handleSubmit = async () => {
  await api.submit(data);
  setSuccess(true);
};
```

---

## Summary

**This file contains:**
- Import organization patterns
- Component file structure
- Service file structure
- Type definition patterns
- Test file structure
- Index file patterns
- Component best practices
- Hooks usage patterns
- Event handler patterns

**For other information:**
- **Overview and principles**: See #architecture-overview.md
- **Advanced patterns**: See #architecture-advanced.md

