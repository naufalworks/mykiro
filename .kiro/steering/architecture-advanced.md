---
name: Architecture Advanced
description: Advanced patterns, module boundaries, and architecture decisions
type: global
inclusion: manual
priority: medium
version: 2.0
lastUpdated: 2026-05-03
---

# Architecture - Advanced Patterns

## Module Boundaries (Detailed)

### Component Layer Rules

**What components CAN do:**
- Render UI elements
- Handle user interactions
- Manage local UI state
- Call hooks for logic
- Pass data via props
- Emit events via callbacks

**What components CANNOT do:**
- Make direct API calls
- Contain business logic
- Access localStorage/sessionStorage directly
- Perform complex calculations
- Manage global state directly

**Example:**
```typescript
// ✅ Good - Component delegates to hook
export function UserProfile() {
  const { user, updateUser } = useUser();
  
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={() => updateUser({ name: 'New Name' })}>
        Update
      </button>
    </div>
  );
}

// ❌ Bad - Component has business logic
export function UserProfile() {
  const [user, setUser] = useState(null);
  
  const updateUser = async (data) => {
    const response = await fetch('/api/user', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    const updated = await response.json();
    setUser(updated);
  };
  
  return <div>...</div>;
}
```

---

### Service Layer Rules

**What services CAN do:**
- Make API calls
- Implement business logic
- Transform data
- Validate data
- Manage authentication
- Handle errors

**What services CANNOT do:**
- Import React components
- Use React hooks
- Render JSX
- Access DOM directly
- Manage component state

**Example:**
```typescript
// ✅ Good - Pure service
export class UserService {
  async getUser(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return this.transformUser(response.data);
  }
  
  private transformUser(data: any): User {
    return {
      id: data.id,
      name: data.full_name,
      email: data.email_address
    };
  }
}

// ❌ Bad - Service with React
import { useState } from 'react';

export class UserService {
  useUser(id: string) {  // Don't use hooks in services!
    const [user, setUser] = useState(null);
    // ...
  }
}
```

---

### Hook Layer Rules

**What hooks CAN do:**
- Use other hooks
- Call services
- Manage state
- Handle side effects
- Return values/functions
- Subscribe to events

**What hooks CANNOT do:**
- Render JSX
- Be called conditionally
- Be called in loops
- Be called in callbacks

**Example:**
```typescript
// ✅ Good - Hook with service
export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await userService.getUser(id);
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id]);
  
  return { user, loading };
}

// ❌ Bad - Hook returns JSX
export function useUser(id: string) {
  const [user, setUser] = useState(null);
  
  return <div>{user?.name}</div>;  // Don't return JSX!
}
```

---

### Utility Layer Rules

**What utils CAN do:**
- Pure functions only
- Transform data
- Format values
- Validate input
- Calculate results
- Parse strings

**What utils CANNOT do:**
- Have side effects
- Make API calls
- Access global state
- Use React hooks
- Depend on other layers

**Example:**
```typescript
// ✅ Good - Pure utility
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ❌ Bad - Utility with side effects
export function formatDate(date: Date): string {
  localStorage.setItem('lastFormatted', date.toISOString());  // Side effect!
  return date.toLocaleDateString();
}
```

---

## Dependency Flow

### Allowed Dependencies

```
┌─────────────┐
│  Components │
└──────┬──────┘
       │
       ├──────> Hooks
       ├──────> Utils
       └──────> Types
       
┌─────────────┐
│    Hooks    │
└──────┬──────┘
       │
       ├──────> Services
       ├──────> Utils
       └──────> Types
       
┌─────────────┐
│  Services   │
└──────┬──────┘
       │
       ├──────> Utils
       └──────> Types
       
┌─────────────┐
│    Utils    │
└──────┬──────┘
       │
       └──────> Types
       
┌─────────────┐
│    Types    │
└─────────────┘
       (No dependencies)
```

### Forbidden Dependencies

```
❌ Services → Components
❌ Services → Hooks
❌ Utils → Components
❌ Utils → Hooks
❌ Utils → Services
❌ Types → Anything
```

---

## Advanced Patterns

### Composition Pattern

```typescript
// ✅ Good - Composition
export function UserCard({ user }: UserCardProps) {
  return (
    <Card>
      <UserAvatar user={user} />
      <UserInfo user={user} />
      <UserActions user={user} />
    </Card>
  );
}

// ❌ Bad - Monolithic component
export function UserCard({ user }: UserCardProps) {
  return (
    <div className="card">
      <div className="avatar">
        <img src={user.avatar} alt={user.name} />
      </div>
      <div className="info">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
      <div className="actions">
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  );
}
```

### Render Props Pattern

```typescript
// ✅ Good - Render props for flexibility
export function DataFetcher<T>({ 
  url, 
  children 
}: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [url]);
  
  return children({ data, loading });
}

// Usage
<DataFetcher url="/api/users">
  {({ data, loading }) => (
    loading ? <Spinner /> : <UserList users={data} />
  )}
</DataFetcher>
```

### Compound Components Pattern

```typescript
// ✅ Good - Compound components
export function Tabs({ children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }: TabsListProps) {
  return <div className="tabs-list">{children}</div>;
};

Tabs.Tab = function Tab({ index, children }: TabProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <button 
      className={activeTab === index ? 'active' : ''}
      onClick={() => setActiveTab(index)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function TabPanel({ index, children }: TabPanelProps) {
  const { activeTab } = useTabsContext();
  return activeTab === index ? <div>{children}</div> : null;
};

// Usage
<Tabs>
  <Tabs.List>
    <Tabs.Tab index={0}>Tab 1</Tabs.Tab>
    <Tabs.Tab index={1}>Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel index={0}>Content 1</Tabs.Panel>
  <Tabs.Panel index={1}>Content 2</Tabs.Panel>
</Tabs>
```

---

## Code Splitting

### Route-Based Splitting

```typescript
// ✅ Good - Lazy load routes
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

export function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### Component-Based Splitting

```typescript
// ✅ Good - Lazy load heavy components
const HeavyChart = lazy(() => import('./components/HeavyChart'));

export function Dashboard() {
  return (
    <div>
      <Header />
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart data={data} />
      </Suspense>
    </div>
  );
}
```

---

## Error Boundaries

### Error Boundary Pattern

```typescript
// ✅ Good - Error boundary
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

---

## Performance Optimization

### Memoization

```typescript
// ✅ Good - Memoize expensive calculations
export function ProductList({ products, filter }: ProductListProps) {
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.category === filter);
  }, [products, filter]);
  
  return (
    <div>
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// ✅ Good - Memoize callbacks
export function ProductCard({ product, onUpdate }: ProductCardProps) {
  const handleUpdate = useCallback(() => {
    onUpdate(product.id);
  }, [product.id, onUpdate]);
  
  return <button onClick={handleUpdate}>Update</button>;
}

// ✅ Good - Memoize components
export const ProductCard = React.memo(function ProductCard({ 
  product 
}: ProductCardProps) {
  return <div>{product.name}</div>;
});
```

---

## State Management Patterns

### Local State (useState)

```typescript
// ✅ Good - Local UI state
export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
```

### Shared State (Context)

```typescript
// ✅ Good - Context for shared state
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Server State (React Query)

```typescript
// ✅ Good - React Query for server state
export function UserProfile({ userId }: UserProfileProps) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUser(userId)
  });
  
  if (isLoading) return <Spinner />;
  
  return <div>{user?.name}</div>;
}
```

---

## Testing Strategies

### Unit Testing

```typescript
// ✅ Good - Test pure functions
describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2026-05-03');
    expect(formatDate(date)).toBe('May 3, 2026');
  });
});
```

### Integration Testing

```typescript
// ✅ Good - Test component integration
describe('LoginForm', () => {
  it('submits form with valid credentials', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));
    
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
```

---

## Architecture Decision Records (ADRs)

### When to Create ADR

**Create ADR for:**
- Major architectural changes
- Technology choices
- Design pattern decisions
- Breaking changes
- Performance optimizations

### ADR Template

```markdown
# ADR-001: Use React Query for Server State

## Status
Accepted

## Context
We need a solution for managing server state (API data) that handles:
- Caching
- Background updates
- Optimistic updates
- Error handling

## Decision
Use React Query for all server state management.

## Consequences

### Positive
- Automatic caching and background updates
- Built-in loading and error states
- Optimistic updates support
- Reduced boilerplate

### Negative
- Additional dependency
- Learning curve for team
- Different patterns from local state

## Alternatives Considered
1. Redux Toolkit Query - More complex setup
2. SWR - Less features
3. Custom solution - Too much maintenance
```

---

## Summary

**This file contains:**
- Detailed module boundary rules
- Dependency flow patterns
- Advanced component patterns
- Code splitting strategies
- Error boundary patterns
- Performance optimization
- State management patterns
- Testing strategies
- Architecture decision records

**For other information:**
- **Overview and principles**: See #architecture-overview.md
- **Component patterns**: See #architecture-components.md

