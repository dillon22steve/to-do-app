import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../demo-styling.css']
})
export class AppComponent {
  title = 'angular-quickstart';

  showModal = false
  isLogin = true

  username = ''
  password = ''

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

  submitForm() {
    console.log(this.username, this.password)

    if (this.isLogin) {
      console.log("Logging in...")
    } else {
      console.log("Signing up...")
    }

    this.closeModal()
  }

}
