import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization, OrganizationMember } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = '/api/organizations';

  constructor(private http: HttpClient) {}

  getOrganization(id: string): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/${id}`);
  }

  updateOrganization(id: string, organization: Partial<Organization>): Observable<Organization> {
    return this.http.put<Organization>(`${this.apiUrl}/${id}`, organization);
  }

  getOrganizationMembers(organizationId: string): Observable<OrganizationMember[]> {
    return this.http.get<OrganizationMember[]>(`${this.apiUrl}/${organizationId}/members`);
  }

  addMember(organizationId: string, userId: string, role: string): Observable<OrganizationMember> {
    return this.http.post<OrganizationMember>(`${this.apiUrl}/${organizationId}/members`, {
      userId,
      role
    });
  }

  removeMember(organizationId: string, memberId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${organizationId}/members/${memberId}`);
  }
}
