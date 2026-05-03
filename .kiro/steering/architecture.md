---
name: Architecture
description: File structure, organization, and strict separation rules (see split files for details)
type: global
inclusion: always
priority: critical
version: 2.0
lastUpdated: 2026-05-03
---

# Architecture - Overview

**This file has been split for better performance and navigation.**

## Core Files (Always Loaded)

- **This file**: Quick overview and navigation
- **architecture-overview.md**: Core principles, file naming, directory structure (always loaded)

## Detailed Files (Load as Needed)

- **#architecture-components.md**: Component patterns, import organization (loads when working on components)
- **#architecture-advanced.md**: Advanced patterns, module boundaries, ADRs

---

## Core Principle

**Strict Separation of Concerns**

Every file has ONE clear purpose. Every directory has ONE clear responsibility.

---

## Quick Reference

### File Structure Standard

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

### File Naming Conventions

```
Components:     PascalCase (Button.tsx, LoginButton.tsx)
Services:       PascalCase (AuthService.ts, ApiClient.ts)
Utilities:      camelCase (formatDate.ts, validateEmail.ts)
Types:          .types.ts suffix (Button.types.ts)
Tests:          .test.ts suffix (Button.test.tsx)
Styles:         .module.css (Button.module.css)
```

### Module Boundaries

```
components/     → UI components only (no business logic, no API calls)
services/       → Business logic only (no UI, no JSX)
hooks/          → React hooks only (reusable logic)
utils/          → Pure functions only (no side effects)
types/          → Type definitions only (no implementation)
```

### File Size Guidelines

```
Component files:  < 100 lines (perfect), > 300 lines (split)
Service files:    < 200 lines (perfect), > 600 lines (split)
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

## Navigation

### Working on components?
→ Load **#architecture-components.md** (auto-loads when editing components)

### Need advanced patterns?
→ Load **#architecture-advanced.md**

### Need code quality rules?
→ See **#code-standards.md**

---

## File Split Information

**Original file**: 732 lines (~3,978 tokens)

**New structure**:
- architecture.md: 100 lines (~600 tokens) - Always loaded
- architecture-overview.md: 200 lines (~1,200 tokens) - Always loaded
- architecture-components.md: 300 lines (~1,800 tokens) - fileMatch (components/**)
- architecture-advanced.md: 232 lines (~1,378 tokens) - Manual

**Total reduction in always-loaded content**: ~2,178 tokens saved (55% reduction)

**Benefits**:
- Faster responses (less context to process)
- Better navigation (focused files)
- Selective loading (component patterns load only when working on components)
- Easier maintenance (smaller, focused files)

