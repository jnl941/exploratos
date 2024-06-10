import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Simulated user ID for demonstration purposes
  private userId: number = -1;
  private userName: string = "";
  private savedUsername: string = "savedUsername";
  
  constructor(private http: HttpClient, private apiService: ApiService) {}
  login(usernameLogin: string, passwordLogin: string): Observable<any>{
    return this.http.post<any>('http://localhost:8080/api/auth/login', { username: usernameLogin, password: passwordLogin})
    
  }
  register(usernameRegister: string, passwordRegister: string): Observable<any>{
    return this.http.post<any>('http://localhost:8080/api/auth/register', { username: usernameRegister, password: passwordRegister }); 
  }
  
  updateUserId(){
    this.apiService.getUserId().subscribe(response => {this.userId = response.id as number})
  }
  saveUsername(name: string){
    localStorage.setItem(this.savedUsername, name)
    this.updateUserId()
  }
  
  // Method to get the user's ID
  getUsername(): string | null {
    return localStorage.getItem(this.savedUsername); // Parse userId as number
  }

  // Method to check if the user is authenticated (you can implement your own logic here)
  isAuthenticated(): boolean {
    // Example: Check if the user is logged in
    return this.userId !== -1; // Return true if the user ID is not null
  }

  // Method to log the user out
  logout(): void {
    // Example: Clear user data from local storage or perform any logout actions
    this.userId = -1; // Clear the user ID
  }
}
