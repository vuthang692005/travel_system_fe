import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthHeader } from '../../components/auth-header';
import { InputField } from '../../../../shared/components/input-field';
import { MatIconModule } from '@angular/material/icon';
import { GoogleButton } from '../../components/google-button';

@Component({
  selector: 'login',
  standalone: true,
  imports: [RouterModule, AuthHeader, InputField, MatIconModule, GoogleButton],
  templateUrl: 'login.html',
})
export class Login {
  loginForm = {
    email: '',
    password: '',
  };

  handleSubmit() {
    console.log(this.loginForm);
  }
}
