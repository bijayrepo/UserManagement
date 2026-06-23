import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import{ environment } from 'src/environments/environment';
import { RegistrationRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

private readonly apiUrl = environment.apiUrl+'/users';

  constructor(private http: HttpClient) { }

  addUser(user: RegistrationRequest): Observable<RegistrationRequest> {
    console.log(user);
    return this.http.post<RegistrationRequest>(
      `${this.apiUrl}/create`,
      user
    );
  }
}