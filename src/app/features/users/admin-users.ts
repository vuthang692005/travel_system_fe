import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { ToastService } from '../../core/services/toast.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog';
import { RejectDialogComponent } from '../../shared/components/reject-dialog'; // Adjust path if needed

@Component({
  selector: 'app-admin-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  template: `
    <div class="min-h-screen bg-[#f8fafc] font-sans pb-20">
      <div class="max-w-[1400px] mx-auto pt-8 px-6">
        <div class="mb-8">
          <h1 class="text-2xl font-black text-[#0f294d]">Quản lý người dùng</h1>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex justify-between items-start"
          >
            <div>
              <p class="text-xs font-black text-slate-500 mb-2">Tổng tài khoản</p>
              <h3 class="text-3xl font-black text-[#0f294d]">{{ totalElements }}</h3>
            </div>
            <div
              class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1ea4e9]"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex justify-between items-start"
          >
            <div>
              <p class="text-xs font-black text-slate-500 mb-2">Đang hoạt động</p>
              <h3 class="text-3xl font-black text-[#0f294d]">{{ activeUsersCount }}</h3>
            </div>
            <div
              class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex justify-between items-start"
          >
            <div>
              <p class="text-xs font-black text-slate-500 mb-2">Đã khóa</p>
              <h3 class="text-3xl font-black text-[#0f294d]">{{ lockedUsersCount }}</h3>
            </div>
            <div
              class="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-t-2xl border-x border-t border-slate-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
        >
          <div class="relative w-full sm:w-[400px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                class="w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              [(ngModel)]="keyword"
              (keyup.enter)="onSearch()"
              placeholder="Tìm kiếm user..."
              class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-[#1ea4e9] focus:bg-white transition-all placeholder:font-medium placeholder:text-slate-400"
            />
          </div>

          <div class="relative w-full sm:w-[200px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <select
              [(ngModel)]="selectedRank"
              (change)="onFilterChange()"
              class="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-[#1ea4e9] focus:ring-2 focus:ring-blue-50 appearance-none cursor-pointer shadow-sm"
            >
              <option value="">Tất cả hạng</option>
              <option value="BRONZE">Bronze</option>
              <option value="SILVER">Silver</option>
              <option value="GOLD">Gold</option>
              <option value="DIAMOND">Diamond</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                class="w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-white border-x border-b border-slate-100 rounded-b-2xl shadow-sm overflow-x-auto relative min-h-[300px]"
        >
          @if (isLoading) {
            <div
              class="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center"
            >
              <div
                class="w-8 h-8 border-4 border-[#1ea4e9]/30 border-t-[#1ea4e9] rounded-full animate-spin"
              ></div>
            </div>
          }

          <table class="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr
                class="bg-slate-50 border-y border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider"
              >
                <th class="py-4 px-6">Người dùng</th>
                <th class="py-4 px-6 text-center">Vai trò</th>
                <th class="py-4 px-6 text-center">Hạng TV</th>
                <th class="py-4 px-6 text-center">Liên hệ</th>
                <th class="py-4 px-6 text-center">Trạng thái</th>
                <th class="py-4 px-6 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @if (!isLoading && users.length === 0) {
                <tr>
                  <td colspan="6" class="py-12 text-center text-slate-500 font-medium">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              }

              @for (user of users; track user.userId) {
                <tr class="hover:bg-slate-50/50 transition-colors group">
                  <td class="py-3 px-6">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-black text-lg shrink-0 overflow-hidden"
                      >
                        {{ user.fullName.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <p class="text-sm font-bold text-slate-800">{{ user.fullName }}</p>
                        <p class="text-xs text-slate-500">{{ user.email }}</p>
                      </div>
                    </div>
                  </td>

                  <td class="py-3 px-6 text-center">
                    <span
                      class="inline-flex items-center gap-1 text-xs font-semibold text-[#1ea4e9]"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {{ getPrimaryRoleLabel(user.roles) }}
                    </span>
                  </td>

                  <td class="py-3 px-6 text-center">
                    <span
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm"
                      [ngClass]="getRankClass(user.membershipRank)"
                    >
                      <svg
                        class="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      {{ user.membershipRank || 'BRONZE' }}
                    </span>
                  </td>

                  <td class="py-3 px-6 text-center">
                    <span class="text-xs font-semibold text-slate-600">{{
                      user.phoneNumber || '--'
                    }}</span>
                  </td>

                  <td class="py-3 px-6 text-center">
                    <div
                      class="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
                      [ngClass]="getStatusClass(user.status)"
                    >
                      @if (user.status === 'ACTIVE') {
                        <svg
                          class="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="3"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      } @else if (user.status === 'LOCKED') {
                        <svg
                          class="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="3"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      }
                      {{ getStatusLabel(user.status) }}
                    </div>
                  </td>

                  <td class="py-3 px-6 text-center">
                    <button
                      (click)="toggleUserLock(user)"
                      class="p-2 rounded-lg transition-colors focus:outline-none"
                      [ngClass]="
                        user.status === 'ACTIVE'
                          ? 'text-slate-400 hover:bg-slate-100'
                          : 'text-emerald-500 hover:bg-emerald-50'
                      "
                      [title]="user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'"
                    >
                      @if (user.status === 'ACTIVE') {
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z"
                          />
                        </svg>
                      } @else {
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                          />
                        </svg>
                      }
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-end gap-4 mt-6 px-2">
          <div class="flex items-center gap-2">
            <button
              (click)="changePage(currentPage - 1)"
              [disabled]="currentPage === 1"
              class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div class="flex gap-1">
              @for (page of totalPagesArray; track page) {
                <button
                  (click)="changePage(page)"
                  [ngClass]="
                    currentPage === page
                      ? 'bg-[#1ea4e9] text-white border-[#1ea4e9]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  "
                  class="w-8 h-8 rounded-lg border text-sm font-bold transition-colors"
                >
                  {{ page }}
                </button>
              }
            </div>

            <button
              (click)="changePage(currentPage + 1)"
              [disabled]="currentPage === totalPages || totalPages === 0"
              class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div class="flex items-center gap-2 text-sm text-slate-500 font-semibold">
            <span>Đi đến:</span>
            <input
              type="number"
              [max]="totalPages"
              min="1"
              (keyup.enter)="changePage(goToPageInput)"
              [(ngModel)]="goToPageInput"
              class="w-14 px-2 py-1.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#1ea4e9] text-center no-spinners"
            />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .no-spinners::-webkit-outer-spin-button,
      .no-spinners::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      .no-spinners {
        -moz-appearance: textfield;
      }
    `,
  ],
})
export class AdminUsersPageComponent implements OnInit {
  private adminService = inject(AdminService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog); // <-- INJECT MAT DIALOG

  users: any[] = [];
  isLoading = false;

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalElements = 0;
  totalPagesArray: number[] = [];
  goToPageInput: number = 1;

  keyword = '';
  selectedRank = '';

  activeUsersCount = 0;
  lockedUsersCount = 0;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.cdr.detectChanges();

    const apiPage = this.currentPage - 1;

    this.adminService.getUsers(apiPage, this.pageSize, this.keyword, this.selectedRank).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const pageData = res?.data || res;

        if (pageData && pageData.content) {
          this.users = pageData.content;
          this.totalElements = pageData.totalElements || 0;
          this.totalPages = pageData.totalPages || 1;
          this.updatePaginationArray();

          this.activeUsersCount = this.users.filter((u: any) => u.status === 'ACTIVE').length;
          this.lockedUsersCount = this.users.filter((u: any) => u.status === 'LOCKED').length;
        } else {
          this.users = [];
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.users = [];
        this.toast.show('Không thể lấy danh sách người dùng', 'error');
        console.error(err);
        this.cdr.detectChanges();
      },
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadUsers();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadUsers();
  }

  // --- LOGIC BAN / UNBAN ---
  toggleUserLock(user: any) {
    const isCurrentlyActive = user.status === 'ACTIVE';

    if (isCurrentlyActive) {
      // 1. NẾU USER ĐANG ACTIVE -> MỞ DIALOG YÊU CẦU NHẬP LÝ DO (BAN)
      const dialogRef = this.dialog.open(RejectDialogComponent, {
        disableClose: true,
        panelClass: 'custom-dialog-container',
      });

      // Override lại thông báo trong Dialog cho hợp lý với việc Ban User
      dialogRef.componentInstance.reason = ''; // Clear reason cũ (nếu có)
      // Note: Nếu muốn đổi title/message của RejectDialog thì nên truyền data vào qua biến MAT_DIALOG_DATA,
      // Nhưng tạm thời nó đang cứng (hardcode) trong component RejectDialog của bạn. Bạn có thể sử dụng nguyên bản.

      dialogRef.afterClosed().subscribe((reason: string | null) => {
        if (reason && reason.trim()) {
          this.executeStatusChange(user.userId, 'BANNED', reason.trim());
        }
      });
    } else {
      // 2. NẾU USER ĐANG BỊ KHOÁ -> MỞ DIALOG XÁC NHẬN MỞ KHÓA (UNBAN)
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        data: {
          title: 'Mở khóa tài khoản',
          message: `Bạn có chắc chắn muốn khôi phục hoạt động cho tài khoản ${user.fullName} không?`,
          icon: 'lock_open',
          confirmText: 'Mở khóa',
          cancelText: 'Hủy',
          confirmColor:
            'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200',
        },
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          // Unban thì không cần reason
          this.executeStatusChange(user.userId, 'ACTIVE');
        }
      });
    }
  }

  // Hàm private để gọi API thực sự
  private executeStatusChange(userId: string, newStatus: 'ACTIVE' | 'BANNED', reason?: string) {
    this.isLoading = true; // Bật màn che
    this.cdr.detectChanges();

    this.adminService.updateUserStatus(userId, newStatus, reason).subscribe({
      next: () => {
        this.toast.show(
          newStatus === 'ACTIVE' ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản',
          'success',
        );
        this.loadUsers(); // Load lại để update UI chuẩn xác
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.show('Thao tác thất bại. Vui lòng thử lại!', 'error');
        console.error(err);
      },
    });
  }

  // --- Logic Phân Trang ---
  updatePaginationArray() {
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, this.currentPage + 2);

    if (this.totalPages > 5) {
      if (startPage === 1) endPage = 5;
      if (endPage === this.totalPages) startPage = this.totalPages - 4;
    }

    this.totalPagesArray = [];
    for (let i = startPage; i <= endPage; i++) {
      this.totalPagesArray.push(i);
    }
  }

  changePage(page: number | string) {
    const pageNum = Number(page);
    if (
      !isNaN(pageNum) &&
      pageNum >= 1 &&
      pageNum <= this.totalPages &&
      pageNum !== this.currentPage
    ) {
      this.currentPage = pageNum;
      this.goToPageInput = pageNum;
      this.loadUsers();
    }
  }

  // --- UI Helpers ---
  getPrimaryRoleLabel(roles: string[]): string {
    if (!roles || roles.length === 0) return 'Khách hàng';
    if (roles.includes('ADMIN')) return 'Quản trị viên';
    if (roles.includes('OWNER')) return 'Chủ khách sạn';
    return 'Khách hàng';
  }

  getRankClass(rank: string): string {
    switch (rank) {
      case 'DIAMOND':
        return 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white';
      case 'GOLD':
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white';
      case 'SILVER':
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-slate-800';
      case 'BRONZE':
      default:
        return 'bg-gradient-to-r from-orange-500 to-rose-500 text-white';
    }
  }

  getStatusLabel(status: string): string {
    if (status === 'ACTIVE') return 'Hoạt động';
    if (status === 'BANNED') return 'Đã khóa';
    return 'Không hoạt động';
  }

  getStatusClass(status: string): string {
    if (status === 'ACTIVE') return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    if (status === 'BANNED') return 'bg-rose-50 text-rose-600 border border-rose-100';
    return 'bg-slate-100 text-slate-500 border border-slate-200';
  }
}
