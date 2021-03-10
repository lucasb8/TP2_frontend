import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {MeService} from '../me.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  errors: string[] = [];
  email = '';
  password = '';

  constructor (private router: Router, private meService: MeService) {}

  async submit () {
    try {
      this.errors = [];
      await this.meService.login({ email: this.email, password: this.password});
      await this.router.navigateByUrl('/profile');
    } catch (err) {
      if (err instanceof HttpErrorResponse) this.errors = err.error?.messages;

      if (!this.errors) {
        this.errors = ['An unknown error has occured'];
        throw err; // resume error propagation, so monitoring tool (if any) catches it
      }
    }
  }
}