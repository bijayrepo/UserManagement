import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../../../core/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl +'/users';

  constructor(private http: HttpClient) {}

  getUserProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`);
  }

  updateUserProfile(userId: string, profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${userId}`, profile);
  }

  uploadProfilePhoto(userId: string, file: File): Observable<UserProfile> {
    const formData = new FormData();
    formData.append('profilePhoto', file);
    return this.http.post<UserProfile>(`${this.apiUrl}/${userId}/upload-photo`, formData);
  }
}
