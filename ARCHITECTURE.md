# Architecture & Module Guide

## Project Architecture Overview

This Angular application follows a modular, scalable architecture designed for enterprise applications.

## High-Level Architecture

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (Components, Templates, Routing)       │
├─────────────────────────────────────────┤
│       Feature Modules Layer             │
│  (Auth, Dashboard, Profile, Org)        │
├─────────────────────────────────────────┤
│         Shared Layer                    │
│  (Shared Components, Pipes)             │
├─────────────────────────────────────────┤
│          Core Layer                     │
│ (Services, Guards, Interceptors)        │
├─────────────────────────────────────────┤
│        HTTP & RxJS Layer                │
│    (Angular HTTP, RxJS Observables)     │
└─────────────────────────────────────────┘
```

## Directory Structure

### 1. Core Module (`src/app/core/`)

**Purpose**: Contains singleton services, guards, interceptors, and core models.

```
core/
├── guards/
│   └── auth.guard.ts           # Route protection for authenticated users
├── interceptors/
│   └── auth.interceptor.ts     # Automatically add JWT token to requests
├── models/
│   ├── user.model.ts           # User data structures
│   ├── organization.model.ts   # Organization data structures
│   └── index.ts                # Barrel export
└── services/
    ├── auth.service.ts         # Authentication logic
    ├── organization.service.ts # Organization API calls
    └── index.ts                # Barrel export
```

**Services Provided**:
- `AuthService`: Manages authentication state and login/logout
- `OrganizationService`: Handles organization API operations

**Guards Provided**:
- `AuthGuard`: Prevents unauthorized access to routes

**Interceptors Provided**:
- `AuthInterceptor`: Adds JWT token to all HTTP requests

### 2. Feature Modules (`src/app/modules/`)

**Purpose**: Independent, feature-specific modules that handle specific business logic.

#### Auth Module
```
modules/auth/
├── components/
│   └── login.component.ts      # Login form and authentication
└── auth.module.ts              # Module definition and routing
```

**Responsibilities**:
- User authentication
- Login form handling
- Session management

**Route**: `/auth/login`

#### Dashboard Module
```
modules/dashboard/
├── components/
│   └── dashboard.component.ts  # Main dashboard view
└── dashboard.module.ts         # Module definition and routing
```

**Responsibilities**:
- Display user welcome information
- Provide navigation to other features
- Show quick action buttons
- Display user stats

**Route**: `/dashboard`

#### Profile Module
```
modules/profile/
├── components/
│   └── profile.component.ts    # Profile management
├── services/
│   └── profile.service.ts      # Profile API operations
└── profile.module.ts           # Module definition and routing
```

**Responsibilities**:
- Display user profile information
- Allow profile updates
- Handle photo upload with preview
- Form validation and error handling

**Route**: `/profile`

#### Organization Module
```
modules/organization/
├── components/
│   └── organization.component.ts # Organization management
└── organization.module.ts        # Module definition and routing
```

**Responsibilities**:
- Display organization information
- Manage organization details
- Manage organization members
- Add/remove members

**Route**: `/organization`

### 3. Shared Module (`src/app/shared/`)

**Purpose**: Reusable components, directives, and pipes shared across the application.

```
shared/
├── components/
│   └── (common UI components)
├── pipes/
│   └── (custom pipes)
└── interceptors/
    └── mock-http.interceptor.ts # Mock API for development
```

## Data Flow Architecture

### Authentication Flow
```
LoginComponent
    ↓
AuthService.login()
    ↓
HTTP Request to /api/auth/login
    ↓
Backend validates credentials
    ↓
Returns JWT token + User data
    ↓
AuthService stores token & user
    ↓
AuthState$ BehaviorSubject updated
    ↓
Router navigates to /dashboard
```

### Protected Route Flow
```
User navigates to /profile
    ↓
Router checks AuthGuard
    ↓
AuthGuard checks AuthService.isAuthenticated()
    ↓
If authenticated: Allow navigation
If not authenticated: Redirect to /auth/login
```

### HTTP Request with Token Flow
```
Any HTTP Request
    ↓
AuthInterceptor intercepts
    ↓
AuthService.getAccessToken()
    ↓
Add "Authorization: Bearer <token>" header
    ↓
Send request
    ↓
If response 401: LogOut & redirect to login
```

## Module Communication

### 1. Service-Based Communication
Services act as mediaries between components and data:

```typescript
// In component
constructor(private authService: AuthService) {}

ngOnInit() {
  this.authService.authState$.subscribe(state => {
    this.user = state.user;
  });
}
```

### 2. Observable-Based State Management
Services expose observables for reactive data flow:

```typescript
// AuthService exposes state as observable
public authState$ = this.authStateSubject.asObservable();

// Components subscribe
this.authService.authState$.pipe(
  takeUntil(this.destroy$)
).subscribe(state => { /* ... */ });
```

### 3. Lazy-Loaded Modules
Modules are loaded on-demand when accessed:

```typescript
// Router configuration
{
  path: 'profile',
  loadChildren: () => import('./modules/profile/profile.module')
    .then(m => m.ProfileModule)
}
```

## Routing Architecture

```
Root Router (app.routes.ts)
├── /auth
│   ├── /login                    (AuthModule)
│   └── /                         (redirects to login)
├── /dashboard                    (DashboardModule) [Protected]
├── /profile                      (ProfileModule) [Protected]
├── /organization                 (OrganizationModule) [Protected]
└── /**                           (redirects to dashboard)
```

## State Management Pattern

Using RxJS BehaviorSubject for simple state management:

```typescript
// Service maintains state
private authStateSubject = new BehaviorSubject<AuthState>({
  isAuthenticated: false,
  loading: false
});

// Expose as observable
public authState$ = this.authStateSubject.asObservable();

// Components subscribe
component$ = this.service.state$.pipe(
  takeUntil(this.destroy$)
);
```

## Data Models

### User Model
```typescript
User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  phoneNumber?: string;
  organizationId: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### UserProfile Model (extends User)
```typescript
UserProfile extends User {
  department?: string;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
}
```

### Organization Model
```typescript
Organization {
  id: string;
  name: string;
  email: string;
  // ... other fields
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Component Communication Patterns

### Parent to Child (via @Input)
```typescript
// Parent
<app-child [data]="parentData"></app-child>

// Child
@Input() data: any;
```

### Child to Parent (via @Output)
```typescript
// Child
@Output() valueChange = new EventEmitter<string>();
onValueChange(val: string) {
  this.valueChange.emit(val);
}

// Parent
<app-child (valueChange)="onValueChange($event)"></app-child>
```

### Via Shared Service
```typescript
// Shared Service
private valueSubject = new BehaviorSubject<string>('');
public value$ = this.valueSubject.asObservable();

setValue(val: string) {
  this.valueSubject.next(val);
}

// Component A subscribes and publishes
this.service.setValue(newValue);

// Component B subscribes
this.service.value$.subscribe(val => { /* ... */ });
```

## Error Handling Pattern

```typescript
// In service
method(): Observable<Data> {
  return this.http.get<Data>(url).pipe(
    catchError(error => {
      console.error('Error:', error);
      // Handle error or re-throw
      return throwError(() => error);
    })
  );
}

// In component
this.service.method().subscribe({
  next: (data) => { /* success */ },
  error: (error) => { /* error */ },
  complete: () => { /* done */ }
});
```

## Dependency Injection

All services use Angular's DI system:

```typescript
// Service declaration
@Injectable({
  providedIn: 'root'  // Available app-wide as singleton
})
export class MyService {}

// Inject in component
constructor(private myService: MyService) {}
```

## Memory Management Pattern

Always unsubscribe from observables:

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(...);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## HTTP Request/Response Cycle

```
Component makes API call
    ↓
Service calls HttpClient
    ↓
AuthInterceptor adds token
    ↓
Request sent to backend
    ↓
Response received
    ↓
Transform data if needed
    ↓
Return Observable to component
    ↓
Component subscribes and handles data
```

## Extending the Architecture

### Adding a New Feature Module

1. Create directory structure:
```
modules/new-feature/
├── components/
│   └── new-feature.component.ts
├── services/
│   └── new-feature.service.ts
└── new-feature.module.ts
```

2. Create routing:
```typescript
const routes: Routes = [
  { path: '', component: NewFeatureComponent }
];
```

3. Add to app routes:
```typescript
{
  path: 'new-feature',
  loadChildren: () => import('./modules/new-feature/new-feature.module')
    .then(m => m.NewFeatureModule),
  canActivate: [AuthGuard]
}
```

### Adding a New Service

1. Create in appropriate module services directory
2. Add @Injectable() decorator
3. Implement required methods
4. Use dependency injection

## Testing Architecture

```
Component Tests (*.spec.ts)
    ↓
Test Bed Setup
    ↓
Mock Services
    ↓
Service Tests
    ↓
Mock HTTP Calls
    ↓
Verify Behavior
```

## Security Architecture

1. **Authentication**: JWT token-based
2. **Authorization**: Route guards + role checks
3. **HTTP Security**: Automatic token attachment via interceptor
4. **Session Management**: Token stored in localStorage (secure in production with httpOnly cookies)
5. **Error Handling**: 401 responses trigger automatic logout

## Performance Optimization

1. **Lazy Loading**: Feature modules loaded on demand
2. **Change Detection**: OnPush strategy for components
3. **Code Splitting**: Automatic via lazy-loaded modules
4. **Tree Shaking**: Unused code removed in production build
5. **Bundle Optimization**: Tree shaking + minification

---

This architecture provides a solid foundation for scaling the application while maintaining code organization and maintainability.
