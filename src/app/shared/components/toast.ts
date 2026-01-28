import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations'; // Thêm bộ công cụ animation
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  animations: [
    trigger('toastAnimation', [
      // Animation khi Toast xuất hiện
      transition(':enter', [
        style({ transform: 'translateX(100%) scale(0.9)', opacity: 0 }),
        animate(
          '400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Hiệu ứng nảy nhẹ (overshoot)
          style({ transform: 'translateX(0) scale(1)', opacity: 1 }),
        ),
      ]),
      // Animation khi Toast biến mất
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(120%)', opacity: 0 })),
      ]),
    ]),
  ],
  template: `
    @if (toast.isVisible()) {
      <div
        @toastAnimation
        class="fixed top-6 right-6 z-[100] flex items-center py-2.5 px-4 rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border backdrop-blur-md"
        [ngClass]="{
          'bg-emerald-50/95 border-emerald-100 text-emerald-900': toast.type() === 'success',
          'bg-red-50/95 border-red-100 text-red-900': toast.type() === 'error',
          'bg-blue-50/95 border-blue-100 text-blue-900': toast.type() === 'info',
        }"
      >
        <div class="mr-3 flex items-center justify-center w-9 h-9 rounded-xl bg-white shadow-sm">
          <mat-icon
            [class]="{
              'text-emerald-500': toast.type() === 'success',
              'text-red-500': toast.type() === 'error',
              'text-blue-500': toast.type() === 'info',
            }"
            class="scale-90"
          >
            {{
              toast.type() === 'success'
                ? 'check_circle'
                : toast.type() === 'error'
                  ? 'error'
                  : 'info'
            }}
          </mat-icon>
        </div>

        <div class="flex flex-col pr-6">
          <p class="text-sm font-semibold leading-tight">{{ toast.message() }}</p>
        </div>

        <button
          (click)="toast.isVisible.set(false)"
          class="absolute right-3 p-1 rounded-full hover:bg-black/5 transition-colors text-slate-400 hover:text-slate-600"
        >
          <mat-icon class="text-[18px] w-[18px] h-[18px]">close</mat-icon>
        </button>
      </div>
    }
  `,
})
export class ToastComponent {
  toast = inject(ToastService);
}
