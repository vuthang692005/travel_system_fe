import { Component, inject, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserStore } from '../../store/user.store';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  template: `
    <header
      class="h-17 bg-white border-b border-gray-100 flex items-center justify-between px-10 z-40"
    >
      <div class="flex items-center gap-4"></div>

      <div class="flex items-center gap-6">
        <button
          routerLink="/"
          class="flex items-center gap-2 cursor-pointer px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all text-[#1a2b49] group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 transition-transform"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Về trang chủ</span>
        </button>

        <div class="flex items-center gap-8">
          <div class="relative cursor-pointer p-1">
            <i class="far fa-bell text-2xl text-gray-700"></i>
            @if (HasNotification) {
              <span
                class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"
              ></span>
            }
          </div>

          <div class="relative">
            <div
              (click)="toggleMenu()"
              class="flex items-center gap-2.5 p-1 pr-3 border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-all"
            >
              <div
                class="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100"
              >
                <img
                  [src]="profilePhotoUrl()"
                  [alt]="userName()"
                  class="w-full h-full object-cover"
                  onerror="this.src = 'avatarDDefault.png'"
                />
              </div>
              <span class="font-bold text-sm text-[#1a2b49]">{{ userName() }}</span>
              <i
                class="fas fa-chevron-down text-[10px] text-gray-500 mt-0.5 transition-transform"
                [class.rotate-180]="isMenuOpen()"
              ></i>
            </div>

            @if (isMenuOpen()) {
              <div
                class="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in zoom-in duration-200"
              >
                <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                  <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-full border-2 border-white/50 overflow-hidden">
                      <img
                        [src]="profilePhotoUrl()"
                        class="w-full h-full object-cover"
                        onerror="this.src = 'avatarDDefault.png'"
                      />
                    </div>
                    <div>
                      <h4 class="font-bold text-lg leading-tight">{{ userName() }}</h4>
                      <p class="text-xs text-white/80">{{ userEmail() }}</p>
                      <div
                        class="mt-2 flex items-center gap-2 bg-black/20 rounded-lg px-2 py-1 w-fit border border-white/10"
                      >
                        <i class="fas fa-shield-alt text-[10px]"></i>
                        <span class="text-[10px] font-bold"
                          >{{ membershipRank() }} | {{ points() }} điểm</span
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <div class="p-2 bg-white">
                  @for (item of menuItems; track item.label) {
                    <a
                      [routerLink]="item.path"
                      (click)="isMenuOpen.set(false)"
                      class="flex items-center gap-4 px-4 py-3 mb-1 rounded-2xl transition-all duration-300 group hover:bg-white hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                    >
                      <div
                        class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:text-white group-hover:shadow-lg"
                        [class]="item.colorClass"
                      >
                        <i [class]="item.icon"></i>
                      </div>
                      <span
                        class="font-medium text-gray-700 transition-colors group-hover:text-[#1a2b49]"
                        >{{ item.label }}</span
                      >

                      <i
                        class="fas fa-chevron-right ml-auto text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                      ></i>
                    </a>
                  }

                  <div class="h-px bg-gray-100 my-2 mx-4"></div>

                  <button
                    (click)="onLogout()"
                    class="cursor-pointer w-full flex items-center gap-4 px-4 py-3 hover:bg-red-50 rounded-2xl transition-colors group text-red-500"
                  >
                    <div
                      class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all"
                    >
                      <i class="fas fa-sign-out-alt"></i>
                    </div>
                    <span class="font-bold">Đăng xuất</span>
                  </button>
                </div>
              </div>

              <div class="fixed inset-0 z-[90]" (click)="isMenuOpen.set(false)"></div>
            }
          </div>
        </div>
      </div>
    </header>
  `,
})
export class Header {
  private userStore = inject(UserStore);
  userDetail = this.userStore.user;
  private router = inject(Router);

  HasNotification: boolean = false;
  isMenuOpen = signal(false);

  userName = computed(() => this.userDetail()?.fullName || 'FullName');
  userEmail = computed(() => this.userDetail()?.email || 'Email');
  membershipRank = computed(() => this.userDetail()?.membershipRank || 'Hạng Đồng');
  points = computed(() => this.userDetail()?.points || 0);
  profilePhotoUrl = computed(() => this.userDetail()?.profilePhotoUrl || '/avatarDefault.jpg');

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

  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }

  onLogout() {
    this.userStore.clearUser();
    localStorage.removeItem('token');
    this.isMenuOpen.set(false);
    this.router.navigate(['/auth']);
  }
}
