import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../../../core/services/property.service'; // Service mới cho Admin
import { PageHeader, FilterStatus } from '../../../shared/components/page-header'; // Component tiêu đề trang
import { AdminPropertyDetailComponent } from './admin-property-detail'; // Đường dẫn trỏ tới file bạn vừa tạo
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog'; // Trỏ đúng đường dẫn
import { RejectDialogComponent } from '../../../shared/components/reject-dialog'; // File vừa tạo ở bước 2
import { ToastService } from '../../../core/services/toast.service';

// Tái sử dụng Interface hoặc tạo mới nếu cần
export interface AdminPropertySummary {
  propertyId: number;
  propertyName: string;
  propertyType: string;
  address: string;
  coverImage: string;
  propertyStatus: string;
  ownerName: string;
  createdAt: string; // Thêm ngày tạo theo thiết kế
}

@Component({
  selector: 'app-admin-property-list',
  standalone: true,
  // Không cần FormsModule nữa vì PageHeader đã lo phần ngModel
  imports: [CommonModule, PageHeader, AdminPropertyDetailComponent],
  template: `
    <div class="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans pb-20">
      <app-page-header
        icon="domain"
        headerTitle="Quản lý Đơn đăng ký"
        subtitle="Phê duyệt và quản lý các cơ sở lưu trú mới"
        searchPlaceholder="Tìm kiếm khách sạn, chủ sở hữu..."
        (onRefresh)="refreshData()"
        (onFilter)="onFilterChange($event)"
        (onSearch)="onSearchChange($event)"
      ></app-page-header>

      @if (isLoading) {
        <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          @for (i of [1, 2, 3]; track i) {
            <div
              class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-pulse"
            >
              <div class="h-44 w-full bg-slate-200"></div>

              <div class="p-4 flex-1 flex flex-col gap-4">
                <div class="h-4 bg-slate-200 rounded w-3/4"></div>

                <div class="space-y-2">
                  <div class="h-3 bg-slate-200 rounded w-full"></div>
                  <div class="h-3 bg-slate-200 rounded w-5/6"></div>
                </div>

                <div
                  class="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-slate-200"></div>
                    <div class="space-y-1">
                      <div class="h-2 bg-slate-200 rounded w-10"></div>
                      <div class="h-3 bg-slate-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div class="h-3 bg-slate-200 rounded w-16"></div>
                </div>

                <div class="mt-2 pt-3">
                  <div class="h-10 bg-slate-200 rounded-xl w-full"></div>
                </div>
              </div>
            </div>
          }
        </div>
      } @else if (filteredProperties.length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          @for (prop of filteredProperties; track prop.propertyId) {
            <div
              class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <div class="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  [src]="prop.coverImage"
                  [alt]="prop.propertyName"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  (error)="handleImageError($event)"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                ></div>

                <div
                  class="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/70 backdrop-blur-sm rounded-lg flex items-center gap-1.5 text-white border border-white/10 shadow-sm"
                >
                  <svg
                    class="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span class="text-[10px] font-bold uppercase tracking-wider">{{
                    prop.propertyType
                  }}</span>
                </div>

                <div
                  class="absolute top-3 right-3 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm font-semibold border border-white/20 backdrop-blur-md"
                  [ngClass]="getStatusStyles(prop)"
                >
                  <svg
                    class="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      [attr.d]="getStatusIcon(prop)"
                    />
                  </svg>
                  <span class="text-[11px]">{{ getStatusLabel(prop) }}</span>
                </div>
              </div>

              <div class="p-4 flex-1 flex flex-col">
                <h3
                  class="text-[15px] font-bold text-slate-800 line-clamp-1 mb-1.5 group-hover:text-[#1ea4e9] transition-colors"
                  [title]="prop.propertyName"
                >
                  {{ prop.propertyName }}
                </h3>

                <div class="flex items-start gap-1.5 text-slate-500 mb-4">
                  <svg
                    class="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p class="text-xs line-clamp-2 leading-relaxed" [title]="prop.address">
                    {{ prop.address }}
                  </p>
                </div>

                <div
                  class="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0"
                    >
                      {{ prop.ownerName ? prop.ownerName.charAt(0).toUpperCase() : 'U' }}
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[10px] text-slate-400 font-medium">Chủ sở hữu</span>
                      <span class="text-xs font-semibold text-slate-700 truncate max-w-[100px]">{{
                        prop.ownerName
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5 text-slate-400">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span class="text-xs font-medium">{{ formatDate(prop.createdAt) }}</span>
                  </div>
                </div>

                <div class="mt-4 pt-3">
                  <button
                    (click)="onViewDetail(prop)"
                    class="w-full py-2 bg-white border border-[#1ea4e9] text-[#1ea4e9] hover:bg-blue-50 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shadow-sm"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div
          class="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center"
        >
          <div
            class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300"
          >
            <svg
              class="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-700">Không tìm thấy đơn đăng ký nào</h3>
          <p class="text-slate-500 text-sm mt-1">
            Danh sách trống hoặc không có kết quả phù hợp với bộ lọc.
          </p>
        </div>
      }

      @if (totalElements > 0) {
        <div
          class="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
        >
          <span class="text-sm text-slate-500 font-medium">
            Hiển thị <strong>{{ currentPage * pageSize + 1 }}</strong> đến
            <strong>{{ mathMin((currentPage + 1) * pageSize, totalElements) }}</strong> trong tổng
            số <strong>{{ totalElements }}</strong> kết quả
          </span>

          <div class="flex items-center gap-1">
            <button
              (click)="changePage(currentPage - 1)"
              [disabled]="currentPage === 0"
              class="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            @for (page of getPageNumbers(); track page) {
              <button
                (click)="changePage(page)"
                class="w-9 h-9 flex items-center justify-center rounded-lg font-bold shadow-sm transition-all"
                [ngClass]="
                  currentPage === page
                    ? 'bg-[#1ea4e9] text-white border-transparent'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                "
              >
                {{ page + 1 }}
              </button>
            }

            <button
              (click)="changePage(currentPage + 1)"
              [disabled]="currentPage >= totalPages - 1"
              class="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      }
    </div>

    @if (selectedDetail) {
      <app-admin-property-detail
        [property]="selectedDetail"
        (onClose)="selectedDetail = null"
        (onApprove)="handleApproveAction($event)"
        (onReject)="handleRejectAction($event)"
      >
      </app-admin-property-detail>
    }
  `,
})
export class AdminPropertyListComponent implements OnInit {
  private adminPropertyService = inject(PropertyService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);
  private dialog = inject(MatDialog);

  properties: AdminPropertySummary[] = [];
  filteredProperties: AdminPropertySummary[] = [];
  isLoading = false;
  selectedDetail: any = null;

  // --- STATE TỪ PAGE HEADER ---
  currentFilterStatus: FilterStatus = ''; // '' | 'PENDING' | 'APPROVED' | 'REJECTED'
  currentSearchTerm: string = '';

  // --- PHÂN TRANG ---
  currentPage: number = 0;
  pageSize: number = 6;
  totalElements: number = 0;
  totalPages: number = 0;

  ngOnInit() {
    this.fetchData();
  }

  // --- GIAO TIẾP VỚI PAGE HEADER ---
  refreshData() {
    this.currentPage = 0;
    this.fetchData();
  }

  onFilterChange(status: FilterStatus) {
    this.currentFilterStatus = status;
    this.currentPage = 0;
    this.fetchData(); // Chuyển Tab -> Gọi API với status mới
  }

  onSearchChange(searchTerm: string) {
    this.currentSearchTerm = searchTerm;
    this.filterLocal(); // Chỉ tìm kiếm ở Client (hoặc bạn có thể gọi API nếu BE hỗ trợ)
  }

  // --- API LOGIC ---
  fetchData() {
    this.isLoading = true;

    // Map 'APPROVED' (từ PageHeader) thành 'APPROVE' (cho chuẩn với API Backend)
    let apiStatus = this.currentFilterStatus === 'APPROVED' ? 'APPROVE' : this.currentFilterStatus;

    // Nếu rỗng '' (Tab Tất cả) thì không gửi param status lên API
    const finalStatus = apiStatus ? apiStatus : undefined;

    this.adminPropertyService
      .getAdminPropertiesList(this.currentPage, this.pageSize, finalStatus)
      .subscribe({
        next: (res) => {
          if (res && res.success && res.data) {
            this.properties = res.data.content;
            this.filteredProperties = [...this.properties];

            this.totalElements = res.data.totalElements;
            this.totalPages = res.data.totalPages;
            this.currentPage = res.data.number;

            if (this.currentSearchTerm.trim()) {
              this.filterLocal();
            }
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Lỗi lấy danh sách:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  filterLocal() {
    if (!this.currentSearchTerm.trim()) {
      this.filteredProperties = [...this.properties];
      return;
    }
    const term = this.currentSearchTerm.toLowerCase();
    this.filteredProperties = this.properties.filter(
      (p) =>
        p.propertyName.toLowerCase().includes(term) ||
        (p.ownerName && p.ownerName.toLowerCase().includes(term)),
    );
  }

  // --- PHÂN TRANG ---
  changePage(pageIndex: number) {
    if (pageIndex >= 0 && pageIndex < this.totalPages) {
      this.currentPage = pageIndex;
      this.fetchData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  // --- UI FORMATTERS ---
  formatDate(dateString: string): string {
    if (!dateString) return '--/--/----';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/default-property.jpg';
  }

  getStatusLabel(prop: AdminPropertySummary): string {
    if (prop.propertyStatus === 'PENDING') return 'Đang chờ duyệt';
    if (prop.propertyStatus === 'REJECTED') return 'Đã từ chối';
    if (prop.propertyStatus === 'APPROVE' || prop.propertyStatus === 'APPROVED') return 'Đã duyệt';
    return 'Không rõ';
  }

  getStatusStyles(prop: AdminPropertySummary): string {
    if (prop.propertyStatus === 'PENDING') return 'bg-amber-500/90 text-white';
    if (prop.propertyStatus === 'REJECTED') return 'bg-rose-500/90 text-white';
    if (prop.propertyStatus === 'APPROVE' || prop.propertyStatus === 'APPROVED')
      return 'bg-emerald-500/90 text-white';
    return 'bg-slate-500/90 text-white';
  }

  getStatusIcon(prop: AdminPropertySummary): string {
    if (prop.propertyStatus === 'PENDING') return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
    if (prop.propertyStatus === 'REJECTED')
      return 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636';
    if (prop.propertyStatus === 'APPROVE' || prop.propertyStatus === 'APPROVED')
      return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
    return '';
  }

  // --- ACTIONS ---
  onViewDetail(prop: any) {
    this.selectedDetail = prop;
  }

  // 1. KHI BẤM DUYỆT HỒ SƠ TỪ MODAL CHI TIẾT
  handleApproveAction(propertyId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      panelClass: 'bg-transparent', // Xóa nền mặc định của Material để bo góc đẹp hơn
      data: {
        title: 'Xác nhận Duyệt',
        message: 'Bạn có chắc chắn muốn phê duyệt hồ sơ đăng ký cơ sở lưu trú này không?',
        confirmText: 'Duyệt hồ sơ',
        confirmColor: 'bg-emerald-600 text-white hover:bg-emerald-700',
        icon: 'check_circle',
      },
    });

    dialogRef.afterClosed().subscribe((isConfirmed: boolean) => {
      if (isConfirmed) {
        this.submitReview(propertyId, 'APPROVE', '');
      }
    });
  }

  // 2. KHI BẤM TỪ CHỐI TỪ MODAL CHI TIẾT
  handleRejectAction(propertyId: number) {
    const dialogRef = this.dialog.open(RejectDialogComponent, {
      width: '400px',
      panelClass: 'bg-transparent',
    });

    dialogRef.afterClosed().subscribe((reason: string | null) => {
      if (reason) {
        // Nếu có trả về lý do (tức là không bấm Hủy)
        this.submitReview(propertyId, 'REJECTED', reason);
      }
    });
  }

  // 3. GỌI API CHUNG CHO CẢ 2 HÀNH ĐỘNG
  private submitReview(propertyId: number, status: string, reason: string) {
    // Bật loading mờ nếu cần
    this.isLoading = true;

    const payload = { status, reason };

    this.adminPropertyService.reviewProperty(propertyId, payload).subscribe({
      next: (res) => {
        if (res.success) {
          const actionText = status === 'APPROVE' ? 'Phê duyệt' : 'Từ chối';
          this.toast.show(`${actionText} cơ sở lưu trú thành công!`, 'success');

          // Đóng modal chi tiết
          this.selectedDetail = null;

          // Load lại danh sách
          this.refreshData();
        } else {
          this.toast.show(res.message || 'Thao tác thất bại!', 'error');
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Lỗi khi review:', err);
        this.toast.show(err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại!', 'error');
        this.isLoading = false;
      },
    });
  }
}
