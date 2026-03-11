import { Injectable, signal, computed } from '@angular/core';
import { UserDetail } from '../core/models/auth.model';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private _user = signal<UserDetail | null>(null);
  // Thêm signal để biết đã load xong dữ liệu khởi tạo chưa
  readonly isInitialLoaded = signal(false);

  rankName = [
    { id: 'BRONZE', name: 'Hạng đồng' },
    { id: 'SILVER', name: 'Hạng bạc' },
    { id: 'GOLD', name: 'Hạng vàng' },
    { id: 'DIAMOND', name: 'Hạng kim cương' },
  ];

  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());

  setUser(user: UserDetail | null) {
    if (user && user.membershipRank) {
      user.membershipRank =
        this.rankName.find((r) => r.id === user.membershipRank)?.name || 'Hạng đồng';
    }
    this._user.set(user);
    this.isInitialLoaded.set(true); // Đánh dấu đã load xong
  }

  clearUser() {
    this._user.set(null);
    this.isInitialLoaded.set(true); // Ngay cả khi lỗi cũng đánh dấu đã xong
  }
}
