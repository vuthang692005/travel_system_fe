import { Component, inject, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserStore } from '../../../store/user.store';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'home-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
})
export class Header {
  private userStore = inject(UserStore);
  private userService = inject(UserService);
  private router = inject(Router);

  isLoggedIn = this.userStore.isLoggedIn;
  HasNotification: boolean = false;
  userDetail = this.userStore.user;
  isAdmin = this.userService.hasRole('ROLE_ADMIN');
  isOwner = this.userService.hasRole('ROLE_OWNER');

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

  roleBasedLink: { label: string; path: string } | null = null;

  constructor() {
    if (this.isAdmin) {
      this.roleBasedLink = { label: 'Trang quản trị', path: '/admin' };
    } else if (this.isOwner) {
      this.roleBasedLink = { label: 'Trang quản lý', path: '/owner' };
    } else {
      this.roleBasedLink = { label: 'Hợp tác với chúng tôi', path: '/partnershipPage' };
    }
  }

  onLogout() {
    this.userStore.clearUser();
    localStorage.removeItem('token');
    this.isMenuOpen.set(false);
    this.router.navigate(['/auth']);
  }
}
