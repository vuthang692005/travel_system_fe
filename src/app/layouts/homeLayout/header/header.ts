import { Component, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStore } from '../../../store/user.store';
import { Router } from '@angular/router';

@Component({
  selector: 'home-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
})
export class Header {
  private userStore = inject(UserStore);
  private router = inject(Router);

  isLoggedIn = this.userStore.isLoggedIn;
  HasNotification: boolean = false;
  userDetail = this.userStore.user;

  userName = computed(() => this.userDetail()?.fullName || 'FullName');
  userEmail = computed(() => this.userDetail()?.email || 'Email');
  membershipRank = computed(() => this.userDetail()?.membershipRank || 'Hạng Đồng');
  points = computed(() => this.userDetail()?.points || 0);
  profilePhotoUrl = computed(() => this.userDetail()?.profilePhotoUrl || '/avatarDefault.jpg');

  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }

  menuItems = [
    {
      label: 'Hồ sơ cá nhân',
      path: '/profile',
      icon: 'far fa-user',
      colorClass: 'bg-blue-50 text-blue-500 group-hover:bg-blue-500 shadow-sm',
    },
    {
      label: 'Hạng thành viên & Điểm',
      path: '/profile/membership',
      icon: 'fas fa-crown text-sm',
      colorClass: 'bg-amber-50 text-amber-500 group-hover:bg-amber-500 shadow-sm',
    },
    {
      label: 'Lịch sử đặt chỗ',
      path: '/profile/history',
      icon: 'far fa-calendar-alt',
      colorClass: 'bg-purple-50 text-purple-500 group-hover:bg-purple-500 shadow-sm',
    },
  ];

  navLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Khuyến mãi', path: '/promotion' },
    { label: 'Về chúng tôi', path: '/about' },
  ];

  onLogout() {
    this.userStore.clearUser();
    localStorage.removeItem('token');
    this.isMenuOpen.set(false);
    this.router.navigate(['/auth']);
  }
}
