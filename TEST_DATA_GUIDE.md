# Test Data Documentation

## Overview

The application includes comprehensive test data for development and testing purposes. Test data is defined in `src/app/shared/test-data/test-data.ts` and is used by the mock HTTP interceptor for API responses.

## Available Test Users

### User 1: John Doe (Admin)
- **Email**: john.doe@acme.com
- **Password**: password123 (any password works in mock mode)
- **Role**: Admin
- **Organization**: Acme Corporation (org-001)
- **Department**: Engineering
- **ID**: user-001

### User 2: Jane Smith (Manager)
- **Email**: jane.smith@acme.com
- **Password**: password123
- **Role**: Manager
- **Organization**: Acme Corporation (org-001)
- **Department**: Product Management
- **ID**: user-002

### User 3: Mike Johnson (User)
- **Email**: mike.johnson@acme.com
- **Password**: password123
- **Role**: User
- **Organization**: Acme Corporation (org-001)
- **Department**: Engineering
- **ID**: user-003

### User 4: Sarah Williams (Manager)
- **Email**: sarah.williams@acme.com
- **Password**: password123
- **Role**: Manager
- **Organization**: Tech Innovations Inc (org-002)
- **Department**: Sales
- **ID**: user-004

### User 5: David Brown (User)
- **Email**: david.brown@acme.com
- **Password**: password123
- **Role**: User
- **Organization**: Tech Innovations Inc (org-002)
- **Department**: Marketing
- **ID**: user-005

## Available Test Organizations

### Organization 1: Acme Corporation
- **ID**: org-001
- **Email**: contact@acme.com
- **Phone**: +1-800-123-4567
- **Members**: John Doe, Jane Smith, Mike Johnson (3 users)
- **Description**: A leading technology company focused on cloud solutions and digital transformation

### Organization 2: Tech Innovations Inc
- **ID**: org-002
- **Email**: hello@techinnovations.com
- **Phone**: +1-888-555-6666
- **Members**: Sarah Williams, David Brown (2 users)
- **Description**: Innovative startup building AI-powered solutions for enterprises

### Organization 3: Global Solutions Ltd
- **ID**: org-003
- **Email**: info@globalsolutions.com
- **Phone**: +1-877-777-8888
- **Members**: None (0 users)
- **Description**: International consulting firm providing business transformation services

## Test Credentials

You can use any of the following credentials to test the login functionality. In mock mode, any email/password combination will work, but these are the predefined test accounts:

```typescript
{
  email: 'john.doe@acme.com',
  password: 'password123',
  userId: 'user-001',
  description: 'Admin user - Full access'
}

{
  email: 'jane.smith@acme.com',
  password: 'password123',
  userId: 'user-002',
  description: 'Manager user - Department access'
}

{
  email: 'mike.johnson@acme.com',
  password: 'password123',
  userId: 'user-003',
  description: 'Regular user - Basic access'
}

{
  email: 'sarah.williams@acme.com',
  password: 'password123',
  userId: 'user-004',
  description: 'Manager in different organization'
}
```

## Using Test Data in Components

### Import Test Data

```typescript
import { TestData } from '@shared/test-data/test-data';
import { getTestUser, getAllTestUsers } from '@shared/test-data/test-data';
```

### Get Specific User

```typescript
const user = TestData.getSampleUser('user-001');
// or
const user = getTestUser('user-001');
```

### Get All Users

```typescript
const allUsers = TestData.getAllSampleUsers();
// or
const allUsers = getAllTestUsers();
```

### Get Users by Organization

```typescript
const acmeUsers = TestData.getUsersByOrganization('org-001');
// Returns: [John Doe, Jane Smith, Mike Johnson]
```

### Get Specific Organization

```typescript
const org = TestData.getSampleOrganization('org-001');
// or
const org = getTestOrganization('org-001');
```

### Get All Organizations

```typescript
const allOrgs = TestData.getAllSampleOrganizations();
// or
const allOrgs = getAllTestOrganizations();
```

### Get Organization Members

```typescript
const members = TestData.getMembersByOrganization('org-001');
// Returns: [member-001, member-002, member-003]
```

### Get Random User

```typescript
const randomUser = TestData.getRandomUser();
```

### Generate Test Update Data

```typescript
const userUpdate = TestData.generateUserUpdate();
// Returns: { phoneNumber, city, country, zipCode, bio, address }

const orgUpdate = TestData.generateOrgUpdate();
// Returns: { phoneNumber, email, city, country, zipCode, description }
```

### Access Test Credentials

```typescript
const testCreds = TestData.TEST_CREDENTIALS;
const testScenarios = TestData.TEST_SCENARIOS;
```

## Test Scenarios

### Basic Login Scenario

```typescript
const scenario = TestData.TEST_SCENARIOS.basicLogin;
// {
//   email: 'john.doe@acme.com',
//   password: 'password123',
//   expectedUser: 'user-001'
// }
```

### Admin User Scenario

```typescript
const scenario = TestData.TEST_SCENARIOS.adminUser;
// {
//   email: 'john.doe@acme.com',
//   password: 'password123',
//   expectedRole: 'admin',
//   expectedOrg: 'org-001'
// }
```

### Multiple Organizations Scenario

```typescript
const scenario = TestData.TEST_SCENARIOS.multipleOrganizations;
// {
//   orgs: ['org-001', 'org-002', 'org-003'],
//   userCounts: [3, 2, 0]
// }
```

### Role Hierarchy Scenario

```typescript
const scenario = TestData.TEST_SCENARIOS.roleHierarchy;
// {
//   admin: ['user-001'],
//   manager: ['user-002', 'user-004'],
//   user: ['user-003', 'user-005']
// }
```

## Testing Workflows

### Test Login with Different Users

```typescript
// Test as Admin
const adminCreds = {
  email: 'john.doe@acme.com',
  password: 'password123'
};
// Login and verify admin features

// Test as Manager
const managerCreds = {
  email: 'jane.smith@acme.com',
  password: 'password123'
};
// Login and verify manager features

// Test as Regular User
const userCreds = {
  email: 'mike.johnson@acme.com',
  password: 'password123'
};
// Login and verify user features
```

### Test Profile Updates

```typescript
// Get a user
const user = TestData.getSampleUser('user-001');

// Generate update data
const updateData = TestData.generateUserUpdate();

// Simulate API call
const updatedUser = {
  ...user,
  ...updateData,
  updatedAt: new Date()
};
```

### Test Organization Management

```typescript
// Get organization
const org = TestData.getSampleOrganization('org-001');

// Get members
const members = TestData.getMembersByOrganization('org-001');

// Generate organization update
const orgUpdate = TestData.generateOrgUpdate();

// Simulate adding new member
const newMember = {
  id: `member-${Date.now()}`,
  userId: 'user-005',
  organizationId: 'org-001',
  role: 'user',
  joinedAt: new Date()
};
```

## Adding More Test Data

To add more test data, edit `src/app/shared/test-data/test-data.ts`:

```typescript
// Add new user
static readonly SAMPLE_USERS: Record<string, UserProfile> = {
  'user-006': {
    id: 'user-006',
    email: 'new.user@example.com',
    firstName: 'New',
    lastName: 'User',
    // ... other properties
  }
};

// Add new organization
static readonly SAMPLE_ORGANIZATIONS: Record<string, Organization> = {
  'org-004': {
    id: 'org-004',
    name: 'New Organization',
    // ... other properties
  }
};

// Add new member
static readonly SAMPLE_MEMBERS: OrganizationMember[] = [
  {
    id: 'member-006',
    userId: 'user-006',
    organizationId: 'org-004',
    role: 'admin',
    joinedAt: new Date()
  }
];
```

## Mock API Behavior

The mock HTTP interceptor automatically:
- Returns test data for GET requests
- Updates test data for PUT requests (in-memory only)
- Handles file uploads for profile photos
- Manages organization members
- Simulates realistic delays using RxJS `delay()` operator
- Accepts any email/password combination for login

### API Delay Simulation

Different endpoints have different simulated delays:
- **Login**: 500ms
- **Get Profile**: 300ms
- **Update Profile**: 500ms
- **Upload Photo**: 1000ms
- **Get Organization**: 300ms
- **Update Organization**: 500ms
- **Get Members**: 300ms
- **Add/Remove Member**: 500ms

## Important Notes

⚠️ **Test Data is In-Memory Only**
- Changes made during testing are not persisted
- Refreshing the page resets all data to initial state
- This is by design for testing isolation

✅ **Use for Development**
- Perfect for testing UI without backend
- Useful for testing different user scenarios
- Great for performance testing
- Easy to simulate different data states

✅ **Easy Migration to Real API**
- Simply remove the MockHttpInterceptor
- Add real HTTP interceptor for authentication
- Keep the same data models and services
- No component changes needed

## Troubleshooting

### Test Data Not Loading

If test data isn't appearing:
1. Check that `test-data.ts` is properly imported in `mock-http.interceptor.ts`
2. Verify the mock interceptor is registered in `main.ts`
3. Clear browser cache and restart dev server
4. Check browser console for any errors

### Changes Not Persisting

This is expected behavior. The mock data is in-memory and resets on page refresh. To persist changes during testing, you'll need to:
1. Switch to a real backend API
2. Implement data persistence in localStorage (not recommended for production)
3. Set up a test database

---

For more information about testing in Angular, see [DEVELOPMENT.md](../../DEVELOPMENT.md) and [ARCHITECTURE.md](../../ARCHITECTURE.md).
