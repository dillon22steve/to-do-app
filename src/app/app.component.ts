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

  // for add task modal
  showAddModal = false;
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskDueDate = '';

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
        this.sortTasks();
        console.log("Tasks loaded", this.tasks);
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

  /**
   * sort tasks: earliest due date first, then incomplete before complete
   */
  sortTasks() {
    this.tasks.sort((a, b) => {
      // Parse due dates, treat missing as far future
      const aDate = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
      const bDate = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');

      // Compare dates first
      if (aDate < bDate) return -1;
      if (aDate > bDate) return 1;

      // If dates are equal, incomplete before complete
      return Number(a.completed) - Number(b.completed);
    });
  }

  /**
   * mark a task complete locally and keep the list sorted
   */
  completeTask(task: ToDo) {
    // optimistically mark the task locally only after server confirms
    this.authService.markTaskComplete(task.id, this.username, this.password).subscribe({
      next: () => {
        task.completed = true;
        // resort the list
        this.sortTasks();
      },
      error: (err) => {
        console.error('Failed to mark task complete', err);
        alert('Could not complete task. Please try again.');
      }
    });
  }

  /**
   * mark a task incomplete locally and keep the list sorted
   */
  uncompleteTask(task: ToDo) {
    this.authService.markTaskIncomplete(task.id, this.username, this.password).subscribe({
      next: () => {
        task.completed = false;
        // resort the list
        this.sortTasks();
      },
      error: (err) => {
        console.error('Failed to mark task incomplete', err);
        alert('Could not uncomplete task. Please try again.');
      }
    });
  }

  /**
   * show the add task modal
   */
  toggleAddToDo() {
    this.showAddModal = true;
  }

  /**
   * submit the new task form
   */
  submitAddToDo() {
    if (!this.newTaskTitle.trim()) {
      alert('Title is required');
      return;
    }

    const newTask = {
      title: this.newTaskTitle.trim(),
      description: this.newTaskDescription.trim() || undefined,
      dueDate: this.newTaskDueDate || undefined,
      completed: false
    };

    this.authService.createTask(newTask, this.username, this.password).subscribe({
      next: (createdTask) => {
        this.loadTasks(); // refresh the list
        this.closeAddModal();
      },
      error: (err) => {
        console.error('Failed to create task', err);
        alert('Could not create task. Please try again.');
      }
    });
  }

  /**
   * close the add task modal and reset fields
   */
  closeAddModal() {
    this.showAddModal = false;
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskDueDate = '';
  }

  /**
   * delete a task after user confirmation
   */
  deleteTask(task: ToDo) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.authService.deleteTask(task.id, this.username, this.password).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== task.id);
        },
        error: (err) => {
          console.error('Failed to delete task', err);
          alert('Could not delete task. Please try again.');
        }
      });
    }
  }

}
