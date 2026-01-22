import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthHeader } from '../../components/auth-header';
import { InputField } from '../../../../shared/components/input-field';
import { MatIconModule } from '@angular/material/icon';
import { GoogleButton } from '../../components/google-button';

@Component({
  selector: 'register',
  standalone: true,
  imports: [RouterModule, AuthHeader, InputField, MatIconModule, GoogleButton],
  templateUrl: 'register.html',
})
export class Register {
  registerForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  handleSubmit() {
    console.log(this.registerForm);
  }
}
