import { Injectable, signal, computed } from '@angular/core';
import { UserDetail } from '../core/models/auth.model';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private _user = signal<UserDetail | null>(null);
  // Thêm signal để biết đã load xong dữ liệu khởi tạo chưa
  readonly isInitialLoaded = signal(false);

  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());

  setUser(user: UserDetail | null) {
    this._user.set(user);
    this.isInitialLoaded.set(true); // Đánh dấu đã load xong
  }

  clearUser() {
    this._user.set(null);
    this.isInitialLoaded.set(true); // Ngay cả khi lỗi cũng đánh dấu đã xong
  }
}
