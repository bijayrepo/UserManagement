# API Documentation

This document outlines the expected API endpoints for the User Management System.

## Base URL

```
Development:  http://localhost:3000/api
Production:   https://api.yourdomain.com/api
```

## Authentication Endpoints

### Login
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profilePhoto": "https://...",
    "organizationId": "org-123",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Refresh Token
```
POST /auth/refresh
Authorization: Bearer <token>

Response (200):
{
  "accessToken": "new_token...",
  "user": { ... }
}
```

## User Endpoints

### Get User Profile
```
GET /users/:userId
Authorization: Bearer <token>

Response (200):
{
  "id": "user-123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "profilePhoto": "https://...",
  "phoneNumber": "+1-555-123-4567",
  "organizationId": "org-123",
  "role": "user",
  "department": "Engineering",
  "bio": "...",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "zipCode": "10001",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Update User Profile
```
PUT /users/:userId
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1-555-987-6543",
  "address": "456 Oak Ave",
  "city": "Boston",
  "country": "USA",
  "zipCode": "02101",
  "bio": "Updated bio",
  "department": "Management"
}

Response (200): Updated user object
```

### Upload Profile Photo
```
POST /users/:userId/upload-photo
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- profilePhoto: [File]

Response (200):
{
  "id": "user-123",
  "profilePhoto": "https://...",
  ...
}
```

## Organization Endpoints

### Get Organization
```
GET /organizations/:organizationId
Authorization: Bearer <token>

Response (200):
{
  "id": "org-123",
  "name": "Acme Corporation",
  "description": "...",
  "logo": "https://...",
  "email": "contact@acme.com",
  "phoneNumber": "+1-800-123-4567",
  "address": "789 Corporate Blvd",
  "city": "New York",
  "country": "USA",
  "zipCode": "10001",
  "website": "https://acme.com",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Update Organization
```
PUT /organizations/:organizationId
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "name": "Updated Name",
  "email": "newemail@acme.com",
  "phoneNumber": "+1-800-987-6543",
  "address": "New Address",
  "city": "Boston",
  "description": "Updated description",
  "website": "https://newurl.com"
}

Response (200): Updated organization object
```

### Get Organization Members
```
GET /organizations/:organizationId/members
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "member-1",
    "userId": "user-123",
    "organizationId": "org-123",
    "role": "admin",
    "joinedAt": "2024-01-01T00:00:00Z"
  },
  {
    "id": "member-2",
    "userId": "user-456",
    "organizationId": "org-123",
    "role": "user",
    "joinedAt": "2024-01-15T00:00:00Z"
  }
]
```

### Add Organization Member
```
POST /organizations/:organizationId/members
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "userId": "user-789",
  "role": "manager"
}

Response (201):
{
  "id": "member-3",
  "userId": "user-789",
  "organizationId": "org-123",
  "role": "manager",
  "joinedAt": "2024-01-20T00:00:00Z"
}
```

### Remove Organization Member
```
DELETE /organizations/:organizationId/members/:memberId
Authorization: Bearer <token>

Response (204): No content
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Authentication

All endpoints (except login) require Bearer token authentication:

```
Authorization: Bearer <accessToken>
```

## Rate Limiting

- Rate limit: 100 requests per minute per IP
- Headers returned:
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 99`
  - `X-RateLimit-Reset: 1640101200`

## Data Types

### User Roles
- `admin` - Full system access
- `manager` - Department/organization access
- `user` - Standard user access

### User Status
- `true` - Active user
- `false` - Inactive user

## Pagination (Future)

```
GET /organizations/:id/members?page=1&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## Filtering (Future)

```
GET /organizations/:id/members?role=admin&status=active
```

## Sorting (Future)

```
GET /organizations/:id/members?sort=joinedAt&order=desc
```
