import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthHeader } from '../../components/auth-header';
import { InputField } from '../../../../shared/components/input-field';
import { MatIconModule } from '@angular/material/icon';
import { GoogleButton } from '../../components/google-button';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [RouterLink, AuthHeader, InputField, MatIconModule, GoogleButton],
  templateUrl: 'login.html',
})
export class Login {
  private toast = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  isLoading = signal(false);
  errors = signal({ email: '', password: '' });

  private validate(): boolean {
    let isValid = true;
    const newErrors = { email: '', password: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.email()) {
      newErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else if (!emailRegex.test(this.email())) {
      newErrors.email = 'Email không đúng định dạng';
      isValid = false;
    }

    if (!this.password()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    }

    this.errors.set(newErrors);
    return isValid;
  }

  onLogin() {
    if (!this.validate()) return;
    this.isLoading.set(true);
    this.authService.login({ email: this.email(), password: this.password() }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.data.accessToken);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Đăng nhập thất bại', 'error');
        this.isLoading.set(false);
      },
    });
  }
}
