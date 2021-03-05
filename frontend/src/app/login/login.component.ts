import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  email = '';
  password = '';

  submit () {
    window.alert(`email: '${this.email}', password: '${this.password}'`);
  }
}