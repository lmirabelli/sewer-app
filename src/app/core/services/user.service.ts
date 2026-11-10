import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.backendUrl}/users`

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    const timestamp = new Date().getTime();
  return this.http.get<UserProfile>(`${this.apiUrl}/profile?_t=${timestamp}`);
  }

  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiUrl}/profile`, data);
  }
}