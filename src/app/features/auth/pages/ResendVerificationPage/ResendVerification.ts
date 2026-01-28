import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { InputField } from '../../../../shared/components/input-field';
import { AppButton } from '../../../../shared/components/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resend-verification',
  standalone: true,
  imports: [RouterLink, InputField, AppButton, MatIconModule, CommonModule],
  template: `
    <div
      class="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center relative"
      style="background-image: url('/LuxuryResortPool.avif')"
    >
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <div
        class="relative max-w-md w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
      >
        <div class="h-2.5 w-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>

        <div class="p-10 md:p-12 flex flex-col items-center">
          <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <mat-icon
              class="text-blue-600 text-4xl h-10 w-10 flex items-center justify-center scale-150"
              >mark_email_read</mat-icon
            >
          </div>

          <h2 class="text-2xl font-extrabold text-slate-900 mb-2 text-center">
            Gửi lại mã xác thực
          </h2>
          <p class="text-slate-500 mb-8 text-center text-sm">
            Nhập email của bạn, chúng tôi sẽ gửi lại liên kết kích hoạt tài khoản.
          </p>

          @if (!isSent()) {
            <div class="w-full space-y-4">
              <input-field
                icon="alternate_email"
                type="email"
                placeholder="Email tài khoản của bạn"
                (valueChange)="email.set($event)"
              >
              </input-field>

              <div class="pt-4">
                <app-button
                  label="Gửi yêu cầu"
                  icon="send"
                  [isLoading]="isLoading()"
                  bgColor="bg-slate-900 hover:bg-black text-white w-full rounded-2xl py-4"
                  (onClick)="handleResend()"
                >
                </app-button>
              </div>
            </div>
          } @else {
            <div
              class="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mb-6 w-full text-center"
            >
              <p class="text-emerald-700 font-medium">Đã gửi! Kiểm tra hộp thư của bạn nhé.</p>
            </div>
            <app-button
              label="Gửi lại lần nữa"
              icon="refresh"
              bgColor="bg-slate-100 hover:bg-slate-200 text-slate-700 w-full rounded-2xl py-3"
              (onClick)="isSent.set(false)"
            >
            </app-button>
          }

          <div class="mt-8">
            <a
              routerLink="/auth"
              class="text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <mat-icon class="text-sm h-4 w-4">arrow_back</mat-icon>
              Quay lại Đăng nhập
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ResendVerificationPage {
  private authService = inject(AuthService);

  email = signal('');
  isLoading = signal(false);
  isSent = signal(false);

  handleResend() {
    if (!this.email()) {
      alert('Vui lòng nhập email');
      return;
    }

    this.isLoading.set(true);
    this.authService.resendVerification(this.email()).subscribe({
      next: () => {
        this.isSent.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        alert(err.error?.message || 'Có lỗi xảy ra');
        this.isLoading.set(false);
      },
    });
  }
}
