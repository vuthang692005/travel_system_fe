import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service'; // Chỉnh lại đường dẫn
import { ToastService } from '../../../core/services/toast.service';

export interface ActiveProperty {
  propertyId: number;
  propertyName: string;
  propertyType: string;
  address: string;
  coverImage: string;
}

@Component({
  selector: 'app-property-room-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans pb-20">
      <div class="mb-8">
        <h1 class="text-2xl font-black text-slate-800">Quản lý Phòng nghỉ</h1>
        <p class="text-sm text-slate-500 font-medium mt-1">
          Chọn một cơ sở lưu trú để thiết lập và quản lý danh sách phòng
        </p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm mb-8 overflow-hidden">
        <div class="relative w-full">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="filterLocal()"
            placeholder="Tìm kiếm cơ sở lưu trú..."
            class="w-full pl-12 pr-4 py-4 bg-white outline-none focus:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
          />
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
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
      </div>

      @if (isLoading) {
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          @for (i of [1, 2, 3, 4]; track i) {
            <div
              class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-pulse"
            >
              <div class="h-40 w-full bg-slate-200"></div>
              <div class="p-4 flex flex-col gap-4">
                <div class="space-y-2">
                  <div class="h-3 bg-slate-200 rounded w-1/4"></div>
                  <div class="h-4 bg-slate-200 rounded w-full"></div>
                </div>
                <div class="h-10 bg-slate-200 rounded-xl w-32 mt-2"></div>
              </div>
            </div>
          }
        </div>
      } @else if (filteredProperties.length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (prop of filteredProperties; track prop.propertyId) {
            <div
              class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col group"
            >
              <div class="relative h-40 w-full bg-slate-800 overflow-hidden shrink-0">
                <img
                  [src]="prop.coverImage"
                  [alt]="prop.propertyName"
                  class="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  (error)="handleImageError($event)"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                ></div>

                <div class="absolute bottom-3 left-4 right-4">
                  <h3
                    class="text-base font-bold text-white truncate drop-shadow-md"
                    [title]="prop.propertyName"
                  >
                    {{ prop.propertyName }}
                  </h3>
                  <div class="flex items-center gap-1 mt-1 opacity-90">
                    <svg
                      class="w-3.5 h-3.5 text-slate-300"
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
                    <span
                      class="text-xs font-semibold text-slate-300 uppercase tracking-wide drop-shadow-sm"
                    >
                      {{ prop.propertyType }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="p-4 flex-1 flex flex-col justify-between gap-5">
                <div>
                  <span
                    class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
                  >
                    Địa chỉ
                  </span>
                  <p
                    class="text-[13px] font-medium text-slate-700 line-clamp-2 leading-relaxed"
                    [title]="prop.address"
                  >
                    {{ prop.address }}
                  </p>
                </div>

                <div>
                  <button
                    (click)="goToRoomManagement(prop.propertyId)"
                    class="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#1ea4e9] text-[#1ea4e9] rounded-xl hover:bg-blue-50 transition-colors text-sm font-semibold group-hover:shadow-sm"
                  >
                    Quản lý phòng
                    <svg
                      class="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
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
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-700">Không tìm thấy cơ sở nào</h3>
          <p class="text-slate-500 text-sm mt-1">
            Danh sách trống hoặc không có kết quả phù hợp với tìm kiếm.
          </p>
        </div>
      }
    </div>
  `,
})
export class PropertyRoomListComponent implements OnInit {
  private propertyService = inject(PropertyService);
  private toast = inject(ToastService);
  private router = inject(Router); // Dùng để chuyển trang
  private cdr = inject(ChangeDetectorRef);

  properties: ActiveProperty[] = [];
  filteredProperties: ActiveProperty[] = [];

  isLoading = false;
  searchTerm = '';

  ngOnInit() {
    this.fetchActiveProperties();
  }

  fetchActiveProperties() {
    this.isLoading = true;
    this.propertyService.getMyActiveProperties().subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          // Map đúng 5 trường cần thiết từ JSON
          this.properties = res.data.map((item: any) => ({
            propertyId: item.propertyId,
            propertyName: item.propertyName,
            propertyType: item.propertyType,
            address: item.address,
            coverImage: item.coverImage,
          }));

          this.filteredProperties = [...this.properties];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.show('Không thể tải danh sách cơ sở', 'error');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Chức năng tìm kiếm cục bộ ở Frontend (Lọc theo Tên và Địa chỉ)
  filterLocal() {
    if (!this.searchTerm.trim()) {
      this.filteredProperties = [...this.properties];
      return;
    }

    const query = this.searchTerm.toLowerCase().trim();
    this.filteredProperties = this.properties.filter(
      (p) =>
        p.propertyName.toLowerCase().includes(query) || p.address.toLowerCase().includes(query),
    );
  }

  // Xử lý ảnh lỗi
  handleImageError(event: any) {
    event.target.src = 'assets/images/default-property.jpg';
  }

  // Điều hướng sang trang Quản lý phòng của cơ sở đó
  goToRoomManagement(propertyId: number) {
    this.router.navigate(['/owner/hotels', propertyId]);
  }
}
