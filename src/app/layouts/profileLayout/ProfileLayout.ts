// src/app/layouts/profileLayout/profile-layout.ts
import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../store/user.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './profileLayout.html',
})
export class ProfileLayout {
  private userStore = inject(UserStore);
  private router = inject(Router);

  // Lấy thông tin từ UserStore
  userDetail = this.userStore.user;
  userName = computed(() => this.userDetail()?.fullName || 'Bùi Đăng Quang');
  userEmail = computed(() => this.userDetail()?.email || 'customer@travelmate.vn');
  membershipRank = computed(() => this.userDetail()?.membershipRank || 'BRONZE');
  profilePhotoUrl = computed(() => this.userDetail()?.profilePhotoUrl || '/avatarDefault.jpg');

  // Mảng menu hiển thị ở Sidebar theo yêu cầu
  sidebarMenu = [
    // Thêm exact: true cho trang chủ profile
    { label: 'Hồ sơ cá nhân', path: '/profile', icon: 'far fa-user', exact: true },
    {
      label: 'Hạng thành viên & Điểm',
      path: '/profile/membership',
      icon: 'fas fa-crown',
      exact: false,
    },
    {
      label: 'Lịch sử đặt chỗ',
      path: '/profile/history',
      icon: 'far fa-calendar-alt',
      exact: false,
    },
    {
      label: 'Giao dịch',
      path: '/profile/transactions',
      icon: 'fas fa-exchange-alt',
      exact: false,
    },
    { label: 'Yêu cầu hoàn tiền', path: '/profile/refunds', icon: 'fas fa-sync-alt', exact: false },
    { label: 'Cài đặt tài khoản', path: '/profile/settings', icon: 'fas fa-cog', exact: false },
  ];

  onLogout() {
    this.userStore.clearUser();
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }
}
