import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Signals quản lý trạng thái toast
  message = signal<string | null>(null);
  type = signal<ToastType>('info');
  isVisible = signal(false);

  show(msg: string, type: ToastType = 'info') {
    this.message.set(msg);
    this.type.set(type);
    this.isVisible.set(true);

    // Tự động đóng sau 3 giây
    setTimeout(() => {
      this.isVisible.set(false);
    }, 3000);
  }
}
