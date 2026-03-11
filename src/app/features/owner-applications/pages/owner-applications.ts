import { Component, signal, inject, computed } from '@angular/core';
import { PageHeader, FilterStatus } from '../../../shared/components/page-header';
import { OwnerCard } from '../components/owner-card';
import { MatIcon } from '@angular/material/icon';
import { OwnerApplication, ReviewOwnerRequest } from '../../../core/models/owner-application.model';
import { OwnerApplicationService } from '../../../core/services/ownerApplication.service';
import { OwnerApplicationDetail } from '../components/owner-detail';
import { OwnerActionDialog } from '../components/owner-action-dialog';
import { finalize } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [PageHeader, OwnerCard, MatIcon, OwnerApplicationDetail, OwnerActionDialog],
  template: `
    <div class="bg-white rounded-[0.3rem] p-8 shadow-sm min-h-[600px]">
      <app-page-header
        headerTitle="Phê duyệt Đối tác"
        subtitle="Xác minh hồ sơ đăng ký chủ sở hữu"
        icon="fact_check"
        searchPlaceholder="Tìm kiếm chủ sở hữu..."
        (onRefresh)="refreshData()"
        (onSearch)="handleSearch($event)"
        (onFilter)="handleFilter($event)"
      />

      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          @for (i of [1, 2, 3, 4, 5, 6, 7, 8]; track i) {
            <div class="bg-slate-50 border border-slate-100 rounded-xl p-5 h-[280px] animate-pulse">
              <div class="flex items-start gap-3 mb-5">
                <div class="w-10 h-10 rounded-full bg-slate-200"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-3 bg-slate-200 rounded w-1/3 ml-auto"></div>
                  <div class="h-4 bg-slate-200 rounded w-2/3"></div>
                  <div class="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
              <div class="space-y-3 mt-8">
                <div class="h-3 bg-slate-200 rounded w-full"></div>
                <div class="h-3 bg-slate-200 rounded w-full"></div>
                <div class="pt-3 border-t border-slate-100 flex justify-between">
                  <div class="h-2 bg-slate-200 rounded w-1/4"></div>
                  <div class="h-2 bg-slate-200 rounded w-1/4"></div>
                </div>
              </div>
              <div class="mt-6 h-10 bg-slate-200 rounded-xl w-full"></div>
            </div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          @for (app of applications(); track app.id) {
            <app-owner-card [data]="app" (onView)="viewDetail($event)" />
          } @empty {
            <div
              class="col-span-full py-25 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100"
            >
              <mat-icon class="text-slate-200 scale-[3] mb-4">search_off</mat-icon>
              <p class="text-slate-400 font-bold">Không tìm thấy hồ sơ nào</p>
            </div>
          }
        </div>
      }
    </div>

    @if (selectedApplication()) {
      <app-owner-detail
        [application]="selectedApplication()!"
        (onClose)="selectedApplication.set(null)"
        (onApprove)="handleApproveAction($event)"
        (onReject)="handleRejectAction($event)"
      />
    }

    @if (selectedApplication() && actionMode()) {
      <app-owner-action-dialog
        [application]="selectedApplication()!"
        [mode]="actionMode()!"
        [isLoading]="isProcessing()"
        (onCancel)="actionMode.set(null)"
        (onConfirm)="handleFinalAction($event)"
      />
    }
  `,
})
export class OwnerApplicationsList {
  private ownerApplicationService = inject(OwnerApplicationService);
  toast = inject(ToastService);

  // Quản lý trạng thái Modal
  selectedApplication = signal<OwnerApplication | null>(null);
  actionMode = signal<'APPROVE' | 'REJECT' | null>(null);

  // Quản lý dữ liệu và lọc
  allApplications = signal<OwnerApplication[]>([]);
  searchQuery = signal<string>('');
  statusFilter = signal<string>('');

  isLoading = signal<boolean>(false);
  isProcessing = signal(false);

  applications = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const data = this.allApplications();
    if (!query) return data;
    return data.filter(
      (app) =>
        app.applicantFullName?.toLowerCase().includes(query) ||
        app.applicantEmail?.toLowerCase().includes(query),
    );
  });

  // --- Logic Điều hướng Modal ---

  viewDetail(application: OwnerApplication) {
    this.selectedApplication.set(application);
    this.actionMode.set(null); // Reset action mode khi xem đơn mới
  }

  handleApproveAction(app: OwnerApplication) {
    this.actionMode.set('APPROVE'); // Chuyển từ Detail sang Modal xác nhận Phê duyệt
  }

  handleRejectAction(app: OwnerApplication) {
    this.actionMode.set('REJECT'); // Chuyển từ Detail sang Modal xác nhận Từ chối
  }

  // --- Logic Thực thi cuối cùng ---

  handleFinalAction(event: { id: number; status: string; reason?: string }) {
    this.isProcessing.set(true);
    const requestPayload: ReviewOwnerRequest = {
      status: event.status as 'APPROVED' | 'REJECTED',
      reason: event.reason,
      validForReview: true,
    };

    this.ownerApplicationService
      .reviewApplication(event.id, requestPayload)
      .pipe(finalize(() => this.isProcessing.set(false)))
      .subscribe({
        next: (res) => {
          if (res.success) {
            // Thông báo thành công
            const actionText = event.status === 'APPROVED' ? 'phê duyệt' : 'từ chối';
            this.toast.show(`Đã ${actionText} hồ sơ của ${res.data.applicantFullName}`, 'success');

            // Đóng modal và làm mới danh sách
            this.selectedApplication.set(null);
            this.refreshData();
          }
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Thao tác thất bại', 'error');
        },
      });
  }

  // --- Logic API & Search (giữ nguyên) ---
  getApplications(status?: string) {
    this.isLoading.set(true);
    this.ownerApplicationService.getApplications(status).subscribe({
      next: (data) => {
        this.allApplications.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  refreshData() {
    this.getApplications(this.statusFilter());
  }
  handleSearch(query: string) {
    this.searchQuery.set(query);
  }
  handleFilter(status: FilterStatus) {
    this.statusFilter.set(status);
    this.refreshData();
  }
  constructor() {
    this.refreshData();
  }
}
