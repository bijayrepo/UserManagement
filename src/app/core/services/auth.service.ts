import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { LoginRequest, LoginResponse, User, AuthState } from '../models';
import { getTestCredentials, TestData } from '@app/shared/test-data/test-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    loading: false
  });
  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.authStateSubject.next({
        isAuthenticated: true,
        user: JSON.parse(user),
        loading: false
      });
    }
  }

  // login(credentials: LoginRequest): Observable<LoginResponse> {
  //   this.authStateSubject.next({ ...this.authStateSubject.value, loading: true });

  //   return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
  //     .pipe(
  //       tap(response => {
  //         localStorage.setItem('accessToken', response.accessToken);
  //         localStorage.setItem('user', JSON.stringify(response.user));
  //         this.authStateSubject.next({
  //           isAuthenticated: true,
  //           user: response.user,
  //           loading: false
  //         });
  //       }),
  //       catchError(error => {
  //         this.authStateSubject.next({
  //           isAuthenticated: false,
  //           loading: false,
  //           error: error.error?.message || 'Login failed'
  //         });
  //         throw error;
  //       })
  //     );
  // }
  login(credentials: LoginRequest): Observable<LoginResponse> {
  const testUsers = getTestCredentials();

  const matchedUser = testUsers.find(
    user =>
      user.email === credentials.email &&
      user.password === credentials.password
  );

  if (matchedUser) {
    const userProfile = TestData.getSampleUser(matchedUser.userId);

    const mockResponse: LoginResponse = {
      accessToken: 'mock-jwt-token',
      user: userProfile!
    };

    localStorage.setItem('accessToken', mockResponse.accessToken);
    localStorage.setItem('user', JSON.stringify(mockResponse.user));

    this.authStateSubject.next({
      isAuthenticated: true,
      user: mockResponse.user,
      loading: false
    });

    return of(mockResponse);
  }

  return this.http.post<LoginResponse>(
    `${this.apiUrl}/login`,
    credentials
  );
}

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    this.authStateSubject.next({
      isAuthenticated: false,
      loading: false
    });
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  getCurrentUser(): User | undefined {
    return this.authStateSubject.value.user;
  }

  refresh(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, {})
      .pipe(
        tap(response => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.authStateSubject.next({
            isAuthenticated: true,
            user: response.user,
            loading: false
          });
        })
      );
  }
}
