import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Mock HTTP Interceptor for development and testing
 * Replace with real API calls in production
 */
@Injectable()
export class MockHttpInterceptor implements HttpHandler {
  private mockUsers = {
    'user-123': {
      id: 'user-123',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      profilePhoto: 'https://via.placeholder.com/150',
      phoneNumber: '+1-555-123-4567',
      organizationId: 'org-123',
      role: 'user',
      department: 'Engineering',
      bio: 'Full-stack developer',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      zipCode: '10001',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  };

  private mockOrganization = {
    'org-123': {
      id: 'org-123',
      name: 'Acme Corporation',
      description: 'Leading technology company',
      logo: 'https://via.placeholder.com/100',
      email: 'contact@acme.com',
      phoneNumber: '+1-800-123-4567',
      address: '789 Corporate Blvd',
      city: 'New York',
      country: 'USA',
      zipCode: '10001',
      website: 'https://acme.com',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  };

  private mockMembers = [
    {
      id: 'member-1',
      userId: 'user-123',
      organizationId: 'org-123',
      role: 'admin',
      joinedAt: new Date('2024-01-01')
    },
    {
      id: 'member-2',
      userId: 'user-456',
      organizationId: 'org-123',
      role: 'manager',
      joinedAt: new Date('2024-01-15')
    },
    {
      id: 'member-3',
      userId: 'user-789',
      organizationId: 'org-123',
      role: 'user',
      joinedAt: new Date('2024-01-20')
    }
  ];

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    // Handle authentication login
    if (req.url.includes('/api/auth/login') && req.method === 'POST') {
      return of(
        new HttpResponse({
          status: 200,
          body: {
            accessToken: 'mock-jwt-token-' + Date.now(),
            user: this.mockUsers['user-123']
          }
        })
      ).pipe(delay(500));
    }

    // Handle get user profile
    if (req.url.includes('/api/users/') && req.method === 'GET') {
      const userId = req.url.split('/').pop();
      return of(
        new HttpResponse({
          status: 200,
          body: this.mockUsers[userId as keyof typeof this.mockUsers] || this.mockUsers['user-123']
        })
      ).pipe(delay(300));
    }

    // Handle update user profile
    if (req.url.includes('/api/users/') && req.method === 'PUT') {
      const userId = req.url.split('/').pop();
      const updatedUser = {
        ...this.mockUsers['user-123'],
        ...req.body,
        id: userId,
        updatedAt: new Date()
      };
      return of(
        new HttpResponse({
          status: 200,
          body: updatedUser
        })
      ).pipe(delay(500));
    }

    // Handle upload profile photo
    if (req.url.includes('/api/users/') && req.url.includes('upload-photo') && req.method === 'POST') {
      return of(
        new HttpResponse({
          status: 200,
          body: {
            ...this.mockUsers['user-123'],
            profilePhoto: 'https://via.placeholder.com/150?updated=' + Date.now()
          }
        })
      ).pipe(delay(1000));
    }

    // Handle get organization
    if (req.url.includes('/api/organizations/') && !req.url.includes('members') && req.method === 'GET') {
      const orgId = req.url.split('/').pop();
      return of(
        new HttpResponse({
          status: 200,
          body: this.mockOrganization[orgId as keyof typeof this.mockOrganization] || this.mockOrganization['org-123']
        })
      ).pipe(delay(300));
    }

    // Handle update organization
    if (req.url.includes('/api/organizations/') && !req.url.includes('members') && req.method === 'PUT') {
      const orgId = req.url.split('/').pop();
      const updatedOrg = {
        ...this.mockOrganization['org-123'],
        ...req.body,
        id: orgId,
        updatedAt: new Date()
      };
      return of(
        new HttpResponse({
          status: 200,
          body: updatedOrg
        })
      ).pipe(delay(500));
    }

    // Handle get organization members
    if (req.url.includes('/api/organizations/') && req.url.includes('members') && req.method === 'GET' && !req.url.includes('DELETE')) {
      return of(
        new HttpResponse({
          status: 200,
          body: this.mockMembers
        })
      ).pipe(delay(300));
    }

    // Handle add member
    if (req.url.includes('/api/organizations/') && req.url.includes('members') && req.method === 'POST') {
      const newMember = {
        id: 'member-' + Date.now(),
        ...req.body,
        joinedAt: new Date()
      };
      this.mockMembers.push(newMember);
      return of(
        new HttpResponse({
          status: 201,
          body: newMember
        })
      ).pipe(delay(500));
    }

    // Handle remove member
    if (req.url.includes('/api/organizations/') && req.url.includes('members') && req.method === 'DELETE') {
      const memberId = req.url.split('/').pop();
      this.mockMembers = this.mockMembers.filter(m => m.id !== memberId);
      return of(
        new HttpResponse({
          status: 204,
          body: null
        })
      ).pipe(delay(500));
    }

    // Fallback for unhandled requests
    return throwError(() => new Error('No mock response for ' + req.url));
  }
}

/**
 * To use this mock interceptor in development:
 *
 * 1. In main.ts, add:
 *    import { MockHttpInterceptor } from './app/shared/interceptors/mock-http.interceptor';
 *
 * 2. Update the providers:
 *    {
 *      provide: HTTP_INTERCEPTORS,
 *      useClass: MockHttpInterceptor,
 *      multi: true
 *    }
 *
 * 3. Make sure MockHttpInterceptor is listed BEFORE AuthInterceptor
 */
