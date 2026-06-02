# User Management System

A modern Angular application for user management with organization support, authentication, profile management, and role-based access control.

## Features

- **Authentication Module**: Secure login system with JWT token management
- **Dashboard Module**: User-friendly dashboard with quick actions
- **Profile Module**: Complete user profile management with photo upload
- **Organization Module**: Organization information and member management
- **Modular Architecture**: Separate feature modules for scalability
- **Lazy Loading**: Improved performance with lazy-loaded feature modules
- **Authentication Guard**: Protected routes with role-based access
- **Responsive Design**: Mobile-friendly UI components
- **State Management**: RxJS-based state management for authentication

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── organization.model.ts
│   │   │   └── index.ts
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── organization.service.ts
│   │       └── index.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── login.component.ts
│   │   │   └── auth.module.ts
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   └── dashboard.component.ts
│   │   │   └── dashboard.module.ts
│   │   ├── profile/
│   │   │   ├── components/
│   │   │   │   └── profile.component.ts
│   │   │   ├── services/
│   │   │   │   └── profile.service.ts
│   │   │   └── profile.module.ts
│   │   └── organization/
│   │       ├── components/
│   │       │   └── organization.component.ts
│   │       └── organization.module.ts
│   ├── shared/
│   │   ├── components/
│   │   └── pipes/
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── main.ts
├── assets/
├── styles.scss
└── index.html
```

## Technology Stack

- **Framework**: Angular 18
- **Language**: TypeScript 5.4
- **HTTP Client**: Angular HttpClient
- **Forms**: Reactive Forms
- **Routing**: Angular Router with lazy loading
- **State**: RxJS Observables
- **Styling**: SCSS

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`

3. **Build for production**
   ```bash
   npm run build
   ```

## Available Scripts

- `npm start` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run watch` - Build in watch mode during development
- `npm test` - Run unit tests
- `npm run lint` - Run linting

## Testing

### Test Data

The application includes comprehensive mock data for development and testing:

- **5 Sample Users** with different roles and organizations
- **3 Sample Organizations** with complete details
- **5 Test Credentials** for login testing
- **Mock HTTP Interceptor** that returns test data for all API calls

### Test Credentials

Use any of these credentials to login (in mock mode, any email/password works):

| Email | Password | Role | Organization |
|-------|----------|------|---|
| john.doe@acme.com | password123 | Admin | Acme Corp |
| jane.smith@acme.com | password123 | Manager | Acme Corp |
| mike.johnson@acme.com | password123 | User | Acme Corp |
| sarah.williams@acme.com | password123 | Manager | Tech Innovations |
| david.brown@acme.com | password123 | User | Tech Innovations |

### Quick Start Testing

1. Run the application:
   ```bash
   npm start
   ```

2. Login with any test credential above

3. Test features:
   - Navigate to Profile and update information
   - Upload a profile photo
   - View Organization and members
   - Test multi-organization scenarios

### Test Documentation

- **[TEST_DATA_GUIDE.md](TEST_DATA_GUIDE.md)** - Detailed guide on available test data and usage
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - 15 complete test scenarios with step-by-step instructions
- **[TEST_DATA_INTEGRATION.md](TEST_DATA_INTEGRATION.md)** - Technical details of test data integration

### Helper Methods

The `TestData` class provides convenient methods for accessing test data:

```typescript
// Get specific user
TestData.getSampleUser('user-001');

// Get all users
TestData.getAllSampleUsers();

// Get users by organization
TestData.getUsersByOrganization('org-001');

// Get random user
TestData.getRandomUser();

// Get organization
TestData.getSampleOrganization('org-001');

// Generate test update data
TestData.generateUserUpdate();
TestData.generateOrgUpdate();
```

## Module Details

### Auth Module
- Login component with form validation
- JWT token management
- Session persistence
- Automatic logout on 401 response

### Dashboard Module
- Welcome section with user information
- Quick action buttons
- Organization and role display
- Navigation to other modules

### Profile Module
- User profile information management
- Profile photo upload with preview
- Form validation
- Update profile details (name, email, phone, address, etc.)

### Organization Module
- Organization information management
- Member list and management
- Tab-based interface (Info & Members)
- Add/remove organization members

## API Endpoints (Expected)

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/upload-photo` - Upload profile photo

### Organizations
- `GET /api/organizations/:id` - Get organization details
- `PUT /api/organizations/:id` - Update organization
- `GET /api/organizations/:id/members` - List members
- `POST /api/organizations/:id/members` - Add member
- `DELETE /api/organizations/:id/members/:memberId` - Remove member

## User Roles

- **Admin** - Full system access
- **Manager** - Department-level access
- **User** - Standard user access

## Getting Started

1. **Configure API Base URL**
   - Update the API endpoints in service files
   - Set up a backend API or use mock HTTP interceptor

2. **Implement Backend API**
   - Create API endpoints for authentication
   - Implement user and organization management
   - Set up JWT token validation

3. **Customize Styling**
   - Modify `src/styles.scss` for global styles
   - Customize component styles in individual component files

## Security Features

- JWT token-based authentication
- HTTP Interceptor for automatic token attachment
- Auth Guard for route protection
- Automatic logout on invalid token
- Secure local storage of tokens

## Adding New Features

### To add a new module:

1. Create module directory under `src/app/modules/`
2. Create `components/` and `services/` subdirectories
3. Generate module file with routing
4. Export module in routing configuration
5. Use lazy loading for the module route

### Example:
```typescript
{
  path: 'new-feature',
  loadChildren: () => import('./modules/new-feature/new-feature.module')
    .then(m => m.NewFeatureModule),
  canActivate: [AuthGuard]
}
```

## Best Practices

- Keep components standalone or use feature modules
- Use RxJS observables for async operations
- Implement OnDestroy to unsubscribe from observables
- Use strict mode in TypeScript
- Follow Angular style guide
- Implement lazy loading for feature modules
- Use path aliases in tsconfig for cleaner imports

## Extending the Application

The modular architecture allows easy extension:
- Add new services in module-specific service directories
- Create new modules following the established pattern
- Add shared components in `shared/components`
- Add pipes in `shared/pipes`
- Implement new interceptors in `core/interceptors`

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please contact the development team or create an issue in the repository.