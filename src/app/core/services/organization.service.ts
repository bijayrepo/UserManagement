// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Organization, OrganizationMember } from '../models';

// @Injectable({
//   providedIn: 'root'
// })
// export class OrganizationService {
//   private apiUrl = '/api/organizations';

//   constructor(private http: HttpClient) {}

//   getOrganization(id: string): Observable<Organization> {
//     return this.http.get<Organization>(`${this.apiUrl}/${id}`);
//   }

//   updateOrganization(id: string, organization: Partial<Organization>): Observable<Organization> {
//     return this.http.put<Organization>(`${this.apiUrl}/${id}`, organization);
//   }

//   getOrganizationMembers(organizationId: string): Observable<OrganizationMember[]> {
//     return this.http.get<OrganizationMember[]>(`${this.apiUrl}/${organizationId}/members`);
//   }

//   addMember(organizationId: string, userId: string, role: string): Observable<OrganizationMember> {
//     return this.http.post<OrganizationMember>(`${this.apiUrl}/${organizationId}/members`, {
//       userId,
//       role
//     });
//   }

//   removeMember(organizationId: string, memberId: string): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${organizationId}/members/${memberId}`);
//   }
// }
//Start test
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

import { Organization, OrganizationMember } from '../models';
import { TestData } from '../../shared/test-data/test-data';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = '/api/organizations';

  // Set to false when backend APIs are ready
  private useMockData = true;

  constructor(private http: HttpClient) {}

  getOrganization(id: string): Observable<Organization> {
    if (this.useMockData) {
      const organization = TestData.getSampleOrganization(id);

      if (!organization) {
        return throwError(() => new Error('Organization not found'));
      }

      return of(organization);
    }

    return this.http.get<Organization>(`${this.apiUrl}/${id}`);
  }

  updateOrganization(
    id: string,
    organization: Partial<Organization>
  ): Observable<Organization> {
    if (this.useMockData) {
      const existingOrg = TestData.getSampleOrganization(id);

      if (!existingOrg) {
        return throwError(() => new Error('Organization not found'));
      }

      const updatedOrg: Organization = {
        ...existingOrg,
        ...organization,
        updatedAt: new Date()
      };

      return of(updatedOrg);
    }

    return this.http.put<Organization>(
      `${this.apiUrl}/${id}`,
      organization
    );
  }

  getOrganizationMembers(
    organizationId: string
  ): Observable<OrganizationMember[]> {
    if (this.useMockData) {
      return of(
        TestData.getMembersByOrganization(organizationId)
      );
    }

    return this.http.get<OrganizationMember[]>(
      `${this.apiUrl}/${organizationId}/members`
    );
  }

  addMember(
    organizationId: string,
    userId: string,
    role: string
  ): Observable<OrganizationMember> {
    if (this.useMockData) {
      const newMember: OrganizationMember = {
        id: `member-${Date.now()}`,
        organizationId,
        userId,
        role,
        joinedAt: new Date()
      };

      return of(newMember);
    }

    return this.http.post<OrganizationMember>(
      `${this.apiUrl}/${organizationId}/members`,
      {
        userId,
        role
      }
    );
  }

  removeMember(
    organizationId: string,
    memberId: string
  ): Observable<void> {
    if (this.useMockData) {
      return of(void 0);
    }

    return this.http.delete<void>(
      `${this.apiUrl}/${organizationId}/members/${memberId}`
    );
  }
}