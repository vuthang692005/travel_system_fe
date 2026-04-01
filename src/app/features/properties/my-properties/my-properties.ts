import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../../core/services/property.service';
import { PropertySummary } from '../../../core/models/property.model';
import { ToastService } from '../../../core/services/toast.service';
import { PropertyEditModalComponent } from './property-edit-modal';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PropertyEditModalComponent],
  template: `
    <div class="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans pb-20">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Tài sản của tôi</h1>
          <p class="text-slate-500 text-sm mt-1">
            Quản lý và theo dõi trạng thái các cơ sở lưu trú của bạn
          </p>
        </div>
        <a
          routerLink="/owner/property/registration"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1ea4e9] hover:bg-[#1891d4] text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Thêm cơ sở mới
        </a>
      </div>

      <div
        class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 bg-white p-2 md:p-4 rounded-2xl border border-slate-200 shadow-sm"
      >
        <div class="relative w-full xl:w-80">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="filterProperties()"
            placeholder="Tìm kiếm tài sản..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1ea4e9] focus:ring-2 focus:ring-[#1ea4e9]/20 outline-none transition-all"
          />
          <svg
            class="absolute left-3.5 top-3 w-4 h-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0">
          @for (tab of tabs; track tab.id) {
            <button
              (click)="changeTab(tab.id)"
              class="px-5 py-2.5 text-sm font-semibold rounded-xl whitespace-nowrap transition-all"
              [ngClass]="
                activeTab === tab.id
                  ? 'bg-white shadow-sm border border-slate-200 text-slate-800'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              "
            >
              {{ tab.label }}
            </button>
          }
        </div>
      </div>

      @if (filteredProperties.length > 0) {
        <div class="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          @for (prop of paginatedProperties; track prop.propertyId) {
            <div
              class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              <div class="relative h-48 w-full bg-slate-100 overflow-hidden group">
                <img
                  [src]="prop.coverImage"
                  [alt]="prop.propertyName"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  class="absolute top-3 right-3 px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-sm"
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
                  <span class="text-xs font-bold">{{ getStatusLabel(prop) }}</span>
                </div>
              </div>

              <div class="p-5 flex-1 flex flex-col">
                <h3 class="text-lg font-black text-[#0f294d] truncate" [title]="prop.propertyName">
                  {{ prop.propertyName }}
                </h3>
                <div class="flex items-start gap-1.5 mt-2 text-slate-500">
                  <svg
                    class="w-4 h-4 text-[#1ea4e9] shrink-0 mt-0.5"
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
                  <p class="text-xs truncate" [title]="prop.address">{{ prop.address }}</p>
                </div>

                <div
                  class="flex items-center justify-between mt-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100"
                >
                  <div
                    class="flex flex-col items-center justify-center flex-1 border-r border-slate-200"
                  >
                    <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide"
                      >Loại hình</span
                    >
                    <span class="text-sm font-bold text-slate-800 mt-0.5">{{
                      prop.propertyType
                    }}</span>
                  </div>

                  <div class="flex flex-col items-center justify-center flex-1">
                    <span
                      class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5"
                      >Trạng thái KS</span
                    >
                    @if (prop.propertyStatus === 'APPROVE') {
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          [checked]="prop.active"
                          (click)="onToggleClick($event, prop)"
                          class="sr-only peer"
                        />
                        <div
                          class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1ea4e9]"
                        ></div>
                      </label>
                    } @else if (prop.propertyStatus === 'SUSPENDED') {
                      <span class="text-xs font-bold text-rose-600 mt-0.5">Bị khóa</span>
                    } @else {
                      <span class="text-xs font-bold text-amber-500 mt-0.5">Chờ duyệt</span>
                    }
                  </div>
                </div>

                <div class="mt-auto pt-5 flex items-center gap-3">
                  <button
                    class="flex-1 py-2.5 bg-white border-2 border-[#1ea4e9] text-[#1ea4e9] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
                    (click)="onEditProperty(prop)"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Chỉnh sửa
                  </button>
                  <button
                    class="w-11 h-11 border-2 border-slate-200 text-slate-500 rounded-xl flex items-center justify-center hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    (click)="onViewProperty(prop)"
                  >
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
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
          <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <svg
              class="w-10 h-10 text-slate-300"
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
          <h3 class="text-lg font-bold text-slate-700">Không tìm thấy cơ sở nào</h3>
          <p class="text-slate-500 text-sm mt-1">
            Vui lòng thử thay đổi bộ lọc hoặc thêm cơ sở lưu trú mới.
          </p>
        </div>
      }

      @if (filteredProperties.length > 0) {
        <div
          class="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
        >
          <span class="text-sm text-slate-500 font-medium">
            Hiển thị <strong>{{ (currentPage - 1) * itemsPerPage + 1 }}</strong> đến
            <strong>{{ mathMin }}</strong> trong tổng số
            <strong>{{ filteredProperties.length }}</strong> kết quả
          </span>

          <div class="flex items-center gap-1">
            <button
              (click)="changePage(currentPage - 1)"
              [disabled]="currentPage === 1"
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
            @for (page of [].constructor(totalPages); track $index) {
              <button
                (click)="changePage($index + 1)"
                class="w-9 h-9 flex items-center justify-center rounded-lg font-bold shadow-sm transition-all"
                [ngClass]="
                  currentPage === $index + 1
                    ? 'bg-[#1ea4e9] text-white border-transparent'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                "
              >
                {{ $index + 1 }}
              </button>
            }
            <button
              (click)="changePage(currentPage + 1)"
              [disabled]="currentPage === totalPages"
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

      <app-property-edit-modal
        [(isOpen)]="isModalOpen"
        [propertyDetail]="detailedProperty"
        (save)="handleSaveEdit($event)"
      >
      </app-property-edit-modal>
    </div>
  `,
})
export class MyPropertiesComponent implements OnInit {
  private propertyService = inject(PropertyService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  properties: PropertySummary[] = [];
  filteredProperties: PropertySummary[] = [];
  detailedProperty: any = null;

  searchTerm: string = '';
  activeTab: string = 'ALL';
  currentPage: number = 1;
  itemsPerPage: number = 6;

  isModalOpen = false;
  selectedProperty: PropertySummary | null = null;

  tabs = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'ACTIVE', label: 'Đang hoạt động' },
    { id: 'INACTIVE', label: 'Tạm ngưng' },
    { id: 'PENDING', label: 'Chờ duyệt' },
  ];

  ngOnInit() {
    this.fetchProperties();
  }

  fetchProperties() {
    this.propertyService.getMyProperties().subscribe({
      next: (res) => {
        if (res && res.success) {
          this.properties = res.data;
          this.filterProperties();
        }
      },
      error: (err) => console.error('Lỗi khi lấy danh sách cơ sở:', err),
    });
  }

  changeTab(tabId: string) {
    this.activeTab = tabId;
    this.filterProperties();
  }

  filterProperties() {
    this.filteredProperties = this.properties.filter((prop) => {
      const safeName = prop.propertyName || '';
      const safeAddress = prop.address || '';
      const safeSearchTerm = this.searchTerm || '';

      const matchesSearch =
        safeName.toLowerCase().includes(safeSearchTerm.toLowerCase()) ||
        safeAddress.toLowerCase().includes(safeSearchTerm.toLowerCase());

      let matchesTab = true;
      if (this.activeTab === 'ACTIVE') {
        matchesTab = prop.propertyStatus === 'APPROVE' && prop.active === true;
      } else if (this.activeTab === 'INACTIVE') {
        matchesTab =
          (prop.propertyStatus === 'APPROVE' && prop.active === false) ||
          prop.propertyStatus === 'SUSPENDED';
      } else if (this.activeTab === 'PENDING') {
        matchesTab = prop.propertyStatus === 'PENDING';
      }

      return matchesSearch && matchesTab;
    });

    this.currentPage = 1;
    this.cdr.detectChanges();
  }

  get paginatedProperties(): PropertySummary[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProperties.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProperties.length / this.itemsPerPage) || 1;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.detectChanges();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get mathMin(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredProperties.length);
  }

  onToggleClick(event: Event, prop: PropertySummary) {
    event.preventDefault();
    this.propertyService.togglePropertyStatus(prop.propertyId).subscribe({
      next: (res) => {
        if (res && res.success) {
          prop.active = res.data;
          this.cdr.detectChanges();
        } else {
          alert(res.message || 'Không thể đổi trạng thái lúc này.');
        }
      },
      error: (err) => alert('Đã có lỗi xảy ra. Vui lòng thử lại sau.'),
    });
  }

  getStatusLabel(prop: PropertySummary): string {
    if (prop.propertyStatus === 'PENDING') return 'Chờ duyệt';
    if (prop.propertyStatus === 'REJECTED') return 'Từ chối';
    if (prop.propertyStatus === 'SUSPENDED') return 'Bị đình chỉ';
    if (prop.propertyStatus === 'APPROVE') return prop.active ? 'Đang hoạt động' : 'Tạm ngưng';
    return 'Không rõ';
  }

  getStatusStyles(prop: PropertySummary): string {
    if (prop.propertyStatus === 'PENDING') return 'bg-amber-500/90 text-white';
    if (prop.propertyStatus === 'REJECTED') return 'bg-red-500/90 text-white';
    if (prop.propertyStatus === 'SUSPENDED') return 'bg-rose-600/90 text-white';
    if (prop.propertyStatus === 'APPROVE')
      return prop.active ? 'bg-emerald-500/90 text-white' : 'bg-slate-500/90 text-white';
    return 'bg-slate-500/90 text-white';
  }

  getStatusIcon(prop: PropertySummary): string {
    if (prop.propertyStatus === 'PENDING') return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
    if (prop.propertyStatus === 'REJECTED') return 'M6 18L18 6M6 6l12 12';
    if (prop.propertyStatus === 'SUSPENDED')
      return 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636';
    return 'M5 13l4 4L19 7';
  }

  onEditProperty(prop: PropertySummary) {
    this.selectedProperty = prop;
    this.propertyService.getPropertyById(prop.propertyId).subscribe({
      next: (res) => {
        // API của bạn thường bọc trong res.data, nếu trả thẳng Object thì dùng res
        const propertyData = res.data || res;

        this.detailedProperty = propertyData; // Gán data vào biến
        this.isModalOpen = true; // Mở modal
        this.cdr.detectChanges(); // Ép UI cập nhật
      },
      error: (err) => {
        this.toast.show('Không thể lấy thông tin cơ sở lúc này!', 'error');
      },
    });
  }

  onViewProperty(prop: PropertySummary) {
    console.log(`[ACTION]: Mở trang XEM CHI TIẾT cho: ${prop.propertyName}`);
  }

  handleSaveEdit(payload: any) {
    console.log('[DEBUG] Dữ liệu nhận từ modal edit:', payload);
    if (!this.selectedProperty) return;
    const propertyId = this.selectedProperty.propertyId;

    // Bật trạng thái loading hoặc chặn thao tác nếu cần thiết (tùy chọn)

    this.propertyService.updateProperty(propertyId, payload).subscribe({
      next: (res) => {
        // Giả sử Backend trả về chuẩn chung { success: true, data: { ... } }
        if (res && (res.success === true || res.propertyId)) {
          const updatedData = res; // Đây là response data bạn gửi

          // 1. Tìm vị trí của cơ sở vừa được sửa trong mảng gốc
          const index = this.properties.findIndex((p) => p.propertyId === propertyId);

          if (index !== -1) {
            // 2. Cập nhật lại ĐÚNG các trường hiển thị trên UI Card
            this.properties[index] = {
              ...this.properties[index], // Giữ lại các trường cũ nếu có
              propertyName: updatedData.propertyName,
              propertyType: updatedData.propertyType,
              address: updatedData.address,
              coverImage: updatedData.coverImage,
              active: updatedData.active,
              propertyStatus: updatedData.propertyStatus,
            };
          }

          // 3. Gọi lại hàm filter để mảng `paginatedProperties` tự động cập nhật UI lập tức
          this.filterProperties();
          // 4. Báo thành công
          // this.toast.show('Cập nhật cơ sở thành công!', 'success');
          this.toast.show('Cập nhật thông tin thành công!', 'success');
        } else {
          // Báo lỗi do server từ chối logic
          // this.toast.show(res.message || 'Cập nhật thất bại.', 'error');
          this.toast.show(res.message, 'error');
        }
      },
      error: (err) => {
        this.toast.show('Có lỗi hệ thống, không thể cập nhật lúc này!', 'error');
      },
    });
  }
}
