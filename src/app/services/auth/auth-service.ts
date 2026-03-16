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
  /** optional longer text for the task */
  description?: string;
  /** optional due date */
  dueDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'intelligent-inspiration-production-53d8.up.railway.app/api';

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

  markTaskComplete(id: number, username: string, password: string) {
    const headers = this.createAuthHeader(username, password);
    return this.http.patch(`${this.baseUrl}/tasks/${id}/complete`, {}, { headers });
  }

  markTaskIncomplete(id: number, username: string, password: string) {
    const headers = this.createAuthHeader(username, password);
    return this.http.patch(`${this.baseUrl}/tasks/${id}/incomplete`, {}, { headers });
  }

  createTask(task: Partial<ToDo>, username: string, password: string): Observable<ToDo> {
    const headers = this.createAuthHeader(username, password);
    return this.http.post<ToDo>(`${this.baseUrl}/tasks`, task, { headers });
  }

  deleteTask(id: number, username: string, password: string): Observable<any> {
    const headers = this.createAuthHeader(username, password);
    return this.http.delete(`${this.baseUrl}/tasks/${id}`, { headers });
  }

  private createAuthHeader(username: string, password: string) {
    return new HttpHeaders({
      Authorization: 'Basic ' + btoa(username + ':' + password)
    });
  }

}