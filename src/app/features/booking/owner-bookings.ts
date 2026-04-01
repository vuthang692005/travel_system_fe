import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../core/services/property.service';
import { BookingService } from '../../core/services/booking.service';
import { ToastService } from '../../core/services/toast.service'; // Nhớ import
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog';

@Component({
  selector: 'app-owner-bookings-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  template: `
    <div class="min-h-screen bg-[#f8fafc] font-sans pb-20">
      <div class="max-w-[1400px] mx-auto pt-8 px-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-2xl font-black text-[#0f294d] flex items-center gap-3">
              <div
                class="w-10 h-10 bg-blue-100 text-[#1ea4e9] rounded-xl flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              Quản Lý Lưu Trú
            </h1>
            <p class="text-sm font-semibold text-slate-500 mt-1">
              Theo dõi khách hàng check-in, check-out và thanh toán
            </p>
          </div>

          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <select
                [(ngModel)]="selectedPropertyId"
                (ngModelChange)="loadBookings()"
                [disabled]="isLoadingProperties"
                class="pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-[#1ea4e9] focus:ring-2 focus:ring-blue-50 appearance-none min-w-[200px] cursor-pointer shadow-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
              >
                @if (isLoadingProperties) {
                  <option [ngValue]="null" disabled selected>Đang tải...</option>
                } @else if (properties.length === 0) {
                  <option [ngValue]="null" disabled selected>Chưa có nơi lưu trú</option>
                } @else {
                  @for (prop of properties; track prop.propertyId) {
                    <option [ngValue]="prop.propertyId">{{ prop.propertyName }}</option>
                  }
                }
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

            <button
              (click)="loadBookings()"
              [disabled]="isLoadingBookings || !selectedPropertyId"
              class="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                [class.animate-spin]="isLoadingBookings"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Làm mới
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div
            class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex justify-between items-start"
          >
            <div>
              <p class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                Khách sắp đến
              </p>
              <h3 class="text-4xl font-black text-[#1ea4e9]">{{ stats.upcoming }}</h3>
            </div>
            <div
              class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1ea4e9]"
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex justify-between items-start"
          >
            <div>
              <p class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                Đang lưu trú
              </p>
              <h3 class="text-4xl font-black text-emerald-500">{{ stats.staying }}</h3>
            </div>
            <div
              class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500"
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex justify-between items-start"
          >
            <div>
              <p class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                Chờ thanh toán
              </p>
              <h3 class="text-4xl font-black text-amber-500">{{ stats.pendingPayment }}</h3>
            </div>
            <div
              class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500"
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-t-2xl border-x border-t border-slate-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
        >
          <div class="relative w-full sm:w-[350px]">
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
              [(ngModel)]="searchTerm"
              (input)="applyFilters()"
              placeholder="Tìm phòng, mã booking hoặc tên khách..."
              class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-transparent rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-slate-200 focus:bg-white transition-all placeholder:font-medium placeholder:text-slate-400"
            />
          </div>

          <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto">
            <button
              (click)="setActiveTab('UPCOMING')"
              [ngClass]="
                activeTab === 'UPCOMING'
                  ? 'bg-[#1ea4e9] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              "
              class="px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap"
            >
              Sắp đến
            </button>
            <button
              (click)="setActiveTab('STAYING')"
              [ngClass]="
                activeTab === 'STAYING'
                  ? 'bg-[#1ea4e9] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              "
              class="px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap"
            >
              Đang ở
            </button>
            <button
              (click)="setActiveTab('PENDING')"
              [ngClass]="
                activeTab === 'PENDING'
                  ? 'bg-[#1ea4e9] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              "
              class="px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap"
            >
              Chờ TT
            </button>
            <button
              (click)="setActiveTab('HISTORY')"
              [ngClass]="
                activeTab === 'HISTORY'
                  ? 'bg-[#1ea4e9] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              "
              class="px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap"
            >
              Lịch sử
            </button>
          </div>
        </div>

        <div
          class="bg-white border-x border-b border-slate-100 rounded-b-2xl shadow-sm overflow-x-auto relative"
        >
          @if (isLoadingBookings) {
            <div
              class="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center"
            >
              <div
                class="w-8 h-8 border-4 border-[#1ea4e9]/30 border-t-[#1ea4e9] rounded-full animate-spin"
              ></div>
            </div>
          }

          <table class="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr
                class="bg-slate-50/50 border-y border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider"
              >
                <th class="py-4 px-6">Thông tin phòng & Khách</th>
                <th class="py-4 px-6">Lịch trình</th>
                <th class="py-4 px-6 text-right">Thanh toán</th>
                <th class="py-4 px-6 text-center">Trạng thái</th>
                <th class="py-4 px-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @if (!isLoadingBookings && paginatedBookings.length === 0) {
                <tr>
                  <td colspan="5" class="py-12 text-center text-slate-500 font-medium">
                    Không tìm thấy đơn đặt phòng nào phù hợp.
                  </td>
                </tr>
              }

              @for (b of paginatedBookings; track b.bookingId) {
                <tr class="hover:bg-slate-50/50 transition-colors group">
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="font-black text-slate-800">{{ b.roomName }}</span>
                      <span
                        class="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded"
                        >#{{ b.bookingId }}</span
                      >
                    </div>
                    <div class="flex items-center gap-2">
                      <div
                        class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-bold text-slate-700">{{ b.user?.fullName }}</p>
                        <p class="text-xs text-slate-500 flex items-center gap-1">
                          <svg
                            class="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {{ b.user?.phoneNumber }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="py-4 px-6">
                    <div class="bg-slate-50 rounded-lg p-2.5 border border-slate-100 w-fit mb-1.5">
                      <div
                        class="flex items-center gap-4 text-xs font-semibold text-slate-600 mb-1"
                      >
                        <span class="w-8 text-slate-400">In</span>
                        <span class="font-bold text-slate-800">{{
                          formatShortDate(b.checkInDate)
                        }}</span>
                      </div>
                      <div class="flex items-center gap-4 text-xs font-semibold text-slate-600">
                        <span class="w-8 text-slate-400">Out</span>
                        <span class="font-bold text-slate-800">{{
                          formatShortDate(b.checkOutDate)
                        }}</span>
                      </div>
                    </div>
                    <p class="text-[11px] font-bold text-slate-400 ml-1">
                      {{ b.guestCount }} người •
                      {{ calculateNights(b.checkInDate, b.checkOutDate) }} đêm
                    </p>
                  </td>

                  <td class="py-4 px-6 text-right">
                    <p class="font-black text-slate-800 mb-1">{{ formatPrice(b.totalPrice) }} đ</p>

                    @if (b.paymentStatus === 'APPROVED') {
                      <span
                        class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100"
                      >
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2.5"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Đã TT
                      </span>
                    } @else {
                      <span
                        class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100"
                      >
                        Chưa TT
                      </span>
                    }
                  </td>

                  <td class="py-4 px-6 text-center">
                    <span
                      class="inline-block px-3 py-1 text-xs font-bold rounded-full border"
                      [ngClass]="getStatusClass(b.status)"
                    >
                      {{ getStatusLabel(b.status) }}
                    </span>
                  </td>

                  <td class="py-4 px-6 text-center">
                    @if (b.status === 'CONFIRMED') {
                      <button
                        (click)="handleAction('Check-in', b.bookingId)"
                        class="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-lg transition-colors shadow-sm flex items-center gap-1.5 mx-auto"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        Check-in
                      </button>
                    }
                    @if (b.status === 'CHECKED_IN') {
                      <button
                        (click)="handleAction('Check-out', b.bookingId)"
                        class="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black rounded-lg transition-colors shadow-sm flex items-center gap-1.5 mx-auto"
                      >
                        Check-out
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                      </button>
                    }
                    @if (
                      b.status === 'COMPLETED' ||
                      b.status === 'CANCELLED' ||
                      b.status === 'PENDING_PAYMENT'
                    ) {
                      <span class="text-xs font-semibold text-slate-400 italic"
                        >Không có thao tác</span
                      >
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between mt-6 px-2">
          <p class="text-sm font-semibold text-slate-500">
            Hiển thị <span class="font-black text-slate-800">{{ paginatedBookings.length }}</span> /
            <span class="font-black text-slate-800">{{ filteredBookings.length }}</span> đơn
          </p>

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
        </div>
      </div>
    </div>
  `,
})
export class OwnerBookingsPageComponent implements OnInit {
  private propertyService = inject(PropertyService);
  private bookingService = inject(BookingService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);
  private dialog = inject(MatDialog);

  properties: any[] = [];
  selectedPropertyId: number | null = null;

  allBookings: any[] = [];
  filteredBookings: any[] = [];
  paginatedBookings: any[] = [];

  // Trạng thái Loading
  isLoadingProperties = false;
  isLoadingBookings = false;

  // Stats
  stats = { upcoming: 0, staying: 0, pendingPayment: 0 };

  // Filters
  searchTerm = '';
  activeTab: 'UPCOMING' | 'STAYING' | 'PENDING' | 'HISTORY' = 'UPCOMING';

  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  totalPagesArray: number[] = [];

  ngOnInit() {
    this.fetchProperties();
  }

  // --- API Calls ---
  fetchProperties() {
    this.isLoadingProperties = true;
    this.cdr.detectChanges();

    this.propertyService.getMyActiveProperties().subscribe({
      next: (res: any) => {
        this.isLoadingProperties = false;

        const data = res.data || res;
        this.properties = Array.isArray(data) ? data : [];

        if (this.properties.length > 0) {
          this.selectedPropertyId = this.properties[0].propertyId;
          this.loadBookings();
        } else {
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isLoadingProperties = false;
        this.properties = [];
        console.error('Lỗi khi lấy danh sách nơi lưu trú:', err);
        this.cdr.detectChanges();
      },
    });
  }

  loadBookings() {
    if (!this.selectedPropertyId) return;

    this.isLoadingBookings = true;
    this.cdr.detectChanges();

    this.bookingService.getBookingsByProperty(this.selectedPropertyId).subscribe({
      next: (res: any) => {
        this.isLoadingBookings = false;

        const data = res.data || res;
        this.allBookings = Array.isArray(data) ? data : [];

        this.calculateStats();
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoadingBookings = false;
        this.allBookings = [];
        this.calculateStats();
        this.applyFilters();
        console.error('Lỗi khi lấy danh sách bookings:', err);
        this.cdr.detectChanges();
      },
    });
  }

  // --- Logic Xử Lý Dữ liệu ---
  calculateStats() {
    const bookings = this.allBookings || [];
    this.stats.upcoming = bookings.filter((b) => b.status === 'CONFIRMED').length;
    this.stats.staying = bookings.filter((b) => b.status === 'CHECKED_IN').length;

    // Cập nhật thống kê Chờ thanh toán dựa trên trạng thái PENDING_PAYMENT
    this.stats.pendingPayment = bookings.filter((b) => b.status === 'PENDING_PAYMENT').length;
  }

  setActiveTab(tab: 'UPCOMING' | 'STAYING' | 'PENDING' | 'HISTORY') {
    this.activeTab = tab;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.allBookings || [];

    // 1. Lọc theo Tab
    switch (this.activeTab) {
      case 'UPCOMING':
        filtered = filtered.filter((b) => b.status === 'CONFIRMED');
        break;
      case 'STAYING':
        filtered = filtered.filter((b) => b.status === 'CHECKED_IN');
        break;
      case 'PENDING':
        // Cập nhật logic lọc theo Tab: Chỉ lấy đơn PENDING_PAYMENT
        filtered = filtered.filter((b) => b.status === 'PENDING_PAYMENT');
        break;
      case 'HISTORY':
        filtered = filtered.filter((b) => b.status === 'COMPLETED' || b.status === 'CANCELLED');
        break;
    }

    // 2. Lọc theo Search Term (Tìm theo tên phòng, Tên Khách, hoặc Mã Booking)
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (b) =>
          (b.roomName && b.roomName.toLowerCase().includes(term)) ||
          (b.user && b.user.fullName && b.user.fullName.toLowerCase().includes(term)) ||
          (b.bookingId && b.bookingId.toString().includes(term)),
      );
    }

    this.filteredBookings = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  // --- Logic Phân Trang ---
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredBookings.length / this.pageSize) || 1;
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedBookings = this.filteredBookings.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // --- Logic Action ---
  handleAction(action: 'Check-in' | 'Check-out', bookingId: number) {
    const isCheckIn = action === 'Check-in';

    // 1. Cấu hình nội dung cho Popup Xác nhận
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      data: {
        title: isCheckIn ? 'Xác nhận Check-in' : 'Xác nhận Check-out',
        message: isCheckIn 
          ? `Bạn có chắc chắn muốn thực hiện Check-in cho đơn đặt phòng #${bookingId} này không?`
          : `Bạn có chắc chắn muốn thực hiện Check-out cho đơn đặt phòng #${bookingId} này không? Khách đã hoàn tất lưu trú?`,
        icon: isCheckIn ? 'login' : 'logout',
        confirmText: isCheckIn ? 'Check-in' : 'Check-out',
        cancelText: 'Hủy',
        // Check-in màu xanh lá (emerald), Check-out màu đỏ (rose)
        confirmColor: isCheckIn 
          ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200' 
          : 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-200'
      }
    });

    // 2. Lắng nghe kết quả sau khi người dùng bấm nút trên Popup
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) { // NẾU BẤM XÁC NHẬN (true)
        
        // Hiện loading mờ trên UI nếu muốn (tuỳ chọn)
        this.isLoadingBookings = true; 
        this.cdr.detectChanges();

        if (isCheckIn) {
          // --- GỌI API CHECK-IN ---
          this.bookingService.checkInBooking(bookingId).subscribe({
            next: (res: string) => {
              this.toast.show('Check-in thành công!', 'success');
              this.loadBookings(); // Load lại bảng
            },
            error: (err) => {
              this.isLoadingBookings = false;
              this.toast.show('Có lỗi xảy ra khi Check-in. Vui lòng thử lại!', 'error');
            }
          });
        } else {
          // --- GỌI API CHECK-OUT ---
          this.bookingService.checkOutBooking(bookingId).subscribe({
            next: (res: string) => {
              this.toast.show('Check-out thành công!', 'success');
              this.loadBookings(); // Load lại bảng
            },
            error: (err) => {
              this.isLoadingBookings = false;
              this.toast.show('Có lỗi xảy ra khi Check-out. Vui lòng thử lại!', 'error');
            }
          });
        }
      }
    });
  }

  // --- Helpers UI ---
  getStatusLabel(status: string): string {
    const map: any = {
      PENDING_PAYMENT: 'Chờ thanh toán', // Thêm Label mới
      CONFIRMED: 'Sắp đến',
      CHECKED_IN: 'Đang lưu trú',
      COMPLETED: 'Đã hoàn tất',
      CANCELLED: 'Đã hủy',
    };
    return map[status] || status;
  }

  getStatusClass(status: string): string {
    const map: any = {
      PENDING_PAYMENT: 'text-amber-600 bg-amber-50 border-amber-200', // Thêm Màu mới (Vàng cam)
      CONFIRMED: 'text-blue-600 bg-blue-50 border-blue-200',
      CHECKED_IN: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      COMPLETED: 'text-slate-600 bg-slate-50 border-slate-200',
      CANCELLED: 'text-rose-600 bg-rose-50 border-rose-200',
    };
    return map[status] || 'text-gray-600 bg-gray-50';
  }

  formatPrice(price: number): string {
    return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0';
  }

  formatShortDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  calculateNights(inDate: string, outDate: string): number {
    if (!inDate || !outDate) return 0;
    const start = new Date(inDate);
    const end = new Date(outDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
