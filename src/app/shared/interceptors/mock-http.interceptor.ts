import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TestData } from '../test-data/test-data';

/**
 * Mock HTTP Interceptor for development and testing
 * Replace with real API calls in production
 *
 * Uses test data from TestData class
 */
@Injectable()
export class MockHttpInterceptor implements HttpHandler {
  // Initialize mock data from TestData
  private mockUsers = TestData.SAMPLE_USERS;
  private mockOrganization = TestData.SAMPLE_ORGANIZATIONS;
  private mockMembers = [...TestData.SAMPLE_MEMBERS];

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    // Handle authentication login
    // In mock mode, accept any credentials
    if (req.url.includes('/api/auth/login') && req.method === 'POST') {
      const loginBody = req.body;

      // Find user by email from test credentials, default to first user
      let selectedUser = TestData.getSampleUser('user-001');
      const testCred = TestData.TEST_CREDENTIALS.find(c => c.email === loginBody.email);

      if (testCred) {
        selectedUser = TestData.getSampleUser(testCred.userId);
      }

      return of(
        new HttpResponse({
          status: 200,
          body: {
            accessToken: 'mock-jwt-token-' + Date.now() + '-' + Math.random().toString(36).substring(7),
            user: selectedUser || TestData.getSampleUser('user-001')
          }
        })
      ).pipe(delay(500));
    }

    // Handle get user profile
    if (req.url.includes('/api/users/') && req.method === 'GET') {
      const userId = req.url.split('/').pop();
      const user = this.mockUsers[userId as keyof typeof this.mockUsers] ||
                   TestData.getSampleUser('user-001');

      return of(
        new HttpResponse({
          status: 200,
          body: user
        })
      ).pipe(delay(300));
    }

    // Handle update user profile
    if (req.url.includes('/api/users/') && req.method === 'PUT') {
      const userId = req.url.split('/').pop();
      const existingUser = this.mockUsers[userId as keyof typeof this.mockUsers] ||
                           TestData.getSampleUser('user-001');

      const updatedUser = {
        ...existingUser,
        ...req.body,
        updatedAt: new Date()
      };

      // Update in memory
      this.mockUsers[userId as keyof typeof this.mockUsers] = updatedUser;

      return of(
        new HttpResponse({
          status: 200,
          body: updatedUser
        })
      ).pipe(delay(500));
    }

    // Handle upload profile photo
    if (req.url.includes('/api/users/') && req.url.includes('upload-photo') && req.method === 'POST') {
      const userId = req.url.split('/')[3]; // Extract userId from URL
      const existingUser = this.mockUsers[userId as keyof typeof this.mockUsers] ||
                           TestData.getSampleUser('user-001');

      const updatedUser = {
        ...existingUser,
        profilePhoto: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70),
        updatedAt: new Date()
      };

      // Update in memory
      this.mockUsers[userId as keyof typeof this.mockUsers] = updatedUser;

      return of(
        new HttpResponse({
          status: 200,
          body: updatedUser
        })
      ).pipe(delay(1000));
    }

    // Handle get organization
    if (req.url.includes('/api/organizations/') && !req.url.includes('members') && req.method === 'GET') {
      const orgId = req.url.split('/').pop();
      const org = this.mockOrganization[orgId as keyof typeof this.mockOrganization] ||
                  TestData.getSampleOrganization('org-001');

      return of(
        new HttpResponse({
          status: 200,
          body: org
        })
      ).pipe(delay(300));
    }

    // Handle update organization
    if (req.url.includes('/api/organizations/') && !req.url.includes('members') && req.method === 'PUT') {
      const orgId = req.url.split('/').pop();
      const existingOrg = this.mockOrganization[orgId as keyof typeof this.mockOrganization] ||
                          TestData.getSampleOrganization('org-001');

      const updatedOrg = {
        ...existingOrg,
        ...req.body,
        updatedAt: new Date()
      };

      // Update in memory
      this.mockOrganization[orgId as keyof typeof this.mockOrganization] = updatedOrg;

      return of(
        new HttpResponse({
          status: 200,
          body: updatedOrg
        })
      ).pipe(delay(500));
    }

    // Handle get organization members
    if (req.url.includes('/api/organizations/') && req.url.includes('members') && req.method === 'GET') {
      const orgId = req.url.split('/')[4]; // Extract org ID from URL
      const members = TestData.getMembersByOrganization(orgId);

      return of(
        new HttpResponse({
          status: 200,
          body: members
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
