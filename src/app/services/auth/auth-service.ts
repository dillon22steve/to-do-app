import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDetails {
  username: string;
  password: string;
}

export interface ToDo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login(user : UserDetails): Observable<any> {
    console.log("AuthService: Logging in with user details", user);
    const response = this.http.post(`${this.baseUrl}/users/login`, user);
    return response;
  }

  signup(user : UserDetails): Observable<any> {
    console.log("AuthService: signing up with user details", user);
    const response = this.http.post(`${this.baseUrl}/users/signup`, user);
    return response;
  }

  getTasks(username: string, password: string): Observable<ToDo[]> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(username + ':' + password)
    });
    return this.http.get<ToDo[]>(`${this.baseUrl}/tasks`, { headers });
  }

  private createAuthHeader(username: string, password: string) {
    const auth = btoa(`${username}:${password}`);
    return new HttpHeaders({
      Authorization: `Basic ${auth}`
    });
  }

}