import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthHeader } from '../../components/auth-header';
import { AuthService } from '../../../../core/services/auth.service';
import { InputField } from '../../../../shared/components/input-field';
import { MatIconModule } from '@angular/material/icon';
import { GoogleButton } from '../../components/google-button';
import { ToastService } from '../../../../core/services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'register',
  standalone: true,
  imports: [RouterLink, AuthHeader, InputField, MatIconModule, GoogleButton, CommonModule],
  templateUrl: 'register.html',
})
export class Register {
  private toast = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);

  fullName = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  isAgreed = signal(false); // Signal quản lý trạng thái checkbox

  isLoading = signal(false);
  errors = signal({ fullName: '', email: '', password: '', confirmPassword: '' });

  // Regex kiểm tra mật khẩu mạnh (Khớp với yêu cầu Backend)
  private readonly passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Computed signal để kiểm tra form có hợp lệ hay không
  isFormValid = computed(() => {
    const isFullNameValid = this.fullName().trim().length >= 1;
    const isEmailValid = this.email().trim().length >= 1;
    const isPasswordStrong = this.passwordRegex.test(this.password());
    const isConfirmMatch = this.confirmPassword() !== '';
    const hasAgreed = this.isAgreed();

    return isFullNameValid && isEmailValid && isPasswordStrong && isConfirmMatch && hasAgreed;
  });

  // Giữ nguyên hàm validate() để hiển thị thông báo lỗi khi nhấn đăng ký (nếu cần)
  // Hoặc bạn có thể hiển thị lỗi realtime dựa trên signals
  onRegister() {
    if (!this.isFormValid()) return;
    if (!this.emailRegex.test(this.email())) {
      this.toast.show('Email không hợp lệ', 'error');
      return;
    }
    if (this.password() === this.confirmPassword()) {
      this.toast.show('Mật khẩu nhập lại ko trùng khớp', 'error');
      return;
    }

    const payload = {
      fullName: this.fullName(),
      email: this.email(),
      password: this.password(),
      confirmPassword: this.confirmPassword(),
    };

    this.isLoading.set(true);
    this.authService.register(payload).subscribe({
      next: () => {
        this.toast.show('Đăng ký thành công! Hãy kiểm tra email để xác thực.', 'success');
        this.router.navigate(['/auth']);
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Đăng ký thất bại', 'error');
        this.isLoading.set(false);
      },
    });
  }
}
