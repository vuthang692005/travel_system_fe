import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink, MatIconModule, CommonModule],
  template: `
    <div
      class="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style="background-image: url('/LuxuryResortPool.avif')"
    >
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <div
        class="relative max-w-md w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 transition-all duration-500 transform hover:scale-[1.01]"
      >
        <div
          class="h-2.5 w-full transition-colors duration-500"
          [ngClass]="{
            'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]': status() === 'loading',
            'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]': status() === 'success',
            'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]': status() === 'error',
          }"
        ></div>

        <div class="p-10 md:p-14 flex flex-col items-center text-center">
          @if (status() === 'loading') {
            <div class="relative mb-8">
              <div class="w-24 h-24 border-[6px] border-blue-100 rounded-full"></div>
              <div
                class="absolute top-0 left-0 w-24 h-24 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin"
              ></div>
              <mat-icon
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 text-4xl flex items-center justify-center"
                >sync</mat-icon
              >
            </div>
            <h2 class="text-3xl font-extrabold text-slate-900 mb-3">Đang xác thực</h2>
            <p class="text-slate-600 text-lg">
              Vui lòng đợi trong giây lát, BVTRAVEL đang kiểm tra thông tin của bạn.
            </p>
          } @else if (status() === 'success') {
            <div
              class="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 animate-bounce-short shadow-inner"
            >
              <mat-icon
                class="text-emerald-600 text-5xl h-12 w-12 flex items-center justify-center scale-[2]"
                >check_circle</mat-icon
              >
            </div>
            <h2 class="text-3xl font-extrabold text-slate-900 mb-3">Tuyệt vời!</h2>
            <p class="text-slate-600 mb-10 text-lg leading-relaxed">
              Email đã được xác thực thành công. Bạn đã sẵn sàng để khám phá những chuyến đi cùng
              <span class="text-blue-600 font-bold">BVTRAVEL</span>.
            </p>
            <a
              routerLink="/auth/login"
              class="group w-full py-4 px-8 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg hover:shadow-black/20"
            >
              <span>Đăng nhập ngay</span>
              <mat-icon class="transition-transform group-hover:translate-x-1"
                >arrow_forward</mat-icon
              >
            </a>
          } @else {
            <div
              class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8 shadow-inner"
            >
              <mat-icon
                class="text-red-600 text-5xl h-12 w-12 flex items-center justify-center scale-[2]"
                >error_outline</mat-icon
              >
            </div>
            <h2 class="text-3xl font-extrabold text-slate-900 mb-3">Xác thực lỗi</h2>
            <p class="text-slate-600 mb-10 text-lg leading-relaxed">
              Liên kết đã hết hạn hoặc không hợp lệ. Đừng lo lắng, hãy thử đăng ký lại hoặc liên hệ
              hỗ trợ.
            </p>
            <div class="flex flex-col w-full gap-4">
              <a
                routerLink="/auth/resend-verification"
                class="w-full py-4 px-8 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-600/20"
              >
                <mat-icon>refresh</mat-icon>
                <span>Yêu cầu lại mã</span>
              </a>
              <a
                routerLink="/"
                class="text-slate-500 font-medium hover:text-slate-800 transition-colors py-2"
                >Quay lại trang chủ</a
              >
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .animate-bounce-short {
        animation: bounce 1.2s ease-in-out infinite;
      }
      @keyframes bounce {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-12px);
        }
      }
    `,
  ],
})
export class VerifyEmailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  status = signal<'loading' | 'success' | 'error'>('loading');

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.verifyEmail(token).subscribe({
        next: (res) => {
          if (res.success) {
            this.status.set('success');
          } else {
            this.status.set('error');
          }
        },
        error: () => this.status.set('error'),
      });
    } else {
      this.status.set('error');
    }
  }
}
