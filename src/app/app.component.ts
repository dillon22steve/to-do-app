import { Component } from '@angular/core';
import { AuthService, ToDo } from './services/auth/auth-service';
import { is } from 'cypress/types/bluebird';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../demo-styling.css']
})
export class AppComponent {
  BASE_URL = 'http://localhost:8080/';

  title = 'angular-quickstart';

  showModal = true;
  isLogin = true;
  isAuthenticated = false;

  username: string = ''
  password: string = ''

  tasks: ToDo[] = [];

  constructor(private authService: AuthService) {}


  openLogin() {
    this.isLogin = true
    this.showModal = true
  }

  openSignup() {
    this.isLogin = false
    this.showModal = true
  }

  closeModal() {
    this.showModal = false
  }

  toggleAuthMode() {
    this.isLogin = !this.isLogin
  }

  submitForm() {
    console.log(this.username, this.password)

    if (!this.username || !this.password || this.username.trim() === '' || this.password.trim() === '') {
      alert('Please fill in all fields');
      return;
    }

    const userDetails = { username: this.username, password: this.password };
    console.log("Submitting form with details:", userDetails);

    if (this.isLogin) {
      console.log("Logging in...")

      this.authService.login(userDetails).subscribe({
        next: (response) => {
          console.log("Login successful", response);
          this.loadTasks();
          console.log(this.tasks);
          this.closeModal();
          this.isAuthenticated = true;
        },
        error: (error) => {
          console.error("Login failed", error);
          alert("Login failed!");
        }
      });
    } else {
      console.log("Signing up...")
      this.authService.signup(userDetails).subscribe({
        next: (response) => {
          console.log("Signup successful", response);
          this.loadTasks();
          this.closeModal();
          this.isAuthenticated = true;
          this.showModal = false;
        },
        error: (error) => {
          console.error("Signup failed", error);
          alert("Signup failed!");
        }
      });
    }
  }


  loadTasks() {

    this.authService.getTasks(this.username, this.password).subscribe({

      next: (data) => {
        this.tasks = data;
        console.log("Tasks loaded", data);
      },

      error: (err) => {
        console.error("Failed to load tasks", err);
      }

    });
  }

  logout() {
    this.isAuthenticated = false;
    this.tasks = [];
    this.username = '';
    this.password = '';
    this.isLogin = true;
    this.showModal = true;
  }

}
