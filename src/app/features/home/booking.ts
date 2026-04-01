import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserStore } from '../../store/user.store';
import { ToastService } from '../../core/services/toast.service';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#f5f7fa] font-sans pb-20">
      <div class="max-w-[1200px] mx-auto pt-8 px-4">
        <button
          (click)="goBack()"
          class="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#1ea4e9] transition-colors w-fit"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại chi tiết
        </button>
        <h1 class="text-3xl font-black text-[#0f294d] mt-6 mb-8">Xác nhận & Đặt phòng</h1>
      </div>

      <div class="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div class="lg:col-span-2 flex flex-col gap-6">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100"
            >
              <h2 class="text-lg font-black text-slate-800 flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-[#1ea4e9]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Thông tin liên hệ
              </h2>

              <label class="flex items-center gap-2 cursor-pointer group">
                <div
                  class="relative flex items-center justify-center w-5 h-5 rounded border-2 transition-colors"
                  [ngClass]="
                    isBookingForSelf
                      ? 'border-[#1ea4e9] bg-[#1ea4e9]'
                      : 'border-slate-300 group-hover:border-[#1ea4e9]'
                  "
                >
                  <input
                    type="checkbox"
                    class="sr-only"
                    [(ngModel)]="isBookingForSelf"
                    (change)="toggleAutoFill()"
                  />
                  <svg
                    *ngIf="isBookingForSelf"
                    class="w-3.5 h-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-sm font-semibold text-slate-600 select-none"
                  >Tôi đặt cho <span class="text-[#1ea4e9]">chính mình</span></span
                >
              </label>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-600 uppercase tracking-wide"
                  >Họ và tên <span class="text-rose-500">*</span></label
                >
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      class="w-5 h-5"
                      [ngClass]="isBookingForSelf ? 'text-slate-300' : 'text-slate-400'"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    [(ngModel)]="contactInfo.fullName"
                    [disabled]="isBookingForSelf"
                    placeholder="VD: Nguyen Van A"
                    class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-[#1ea4e9] focus:ring-2 focus:ring-blue-50 transition-all placeholder:font-medium placeholder:text-slate-300 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-600 uppercase tracking-wide"
                  >Số điện thoại <span class="text-rose-500">*</span></label
                >
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      class="w-5 h-5"
                      [ngClass]="isBookingForSelf ? 'text-slate-300' : 'text-slate-400'"
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
                  </div>
                  <input
                    type="text"
                    [(ngModel)]="contactInfo.phone"
                    [disabled]="isBookingForSelf"
                    placeholder="VD: 0912345678"
                    class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-[#1ea4e9] focus:ring-2 focus:ring-blue-50 transition-all placeholder:font-medium placeholder:text-slate-300 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label class="text-xs font-bold text-slate-600 uppercase tracking-wide"
                  >Email nhận vé <span class="text-rose-500">*</span></label
                >
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      class="w-5 h-5"
                      [ngClass]="isBookingForSelf ? 'text-slate-300' : 'text-slate-400'"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    [(ngModel)]="contactInfo.email"
                    [disabled]="isBookingForSelf"
                    placeholder="VD: email@example.com"
                    class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-[#1ea4e9] focus:ring-2 focus:ring-blue-50 transition-all placeholder:font-medium placeholder:text-slate-300 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label class="text-xs font-bold text-slate-600 uppercase tracking-wide"
                  >Yêu cầu đặc biệt</label
                >
                <div class="relative">
                  <div class="absolute top-3 left-3 flex items-start pointer-events-none">
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
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <textarea
                    [(ngModel)]="contactInfo.specialRequest"
                    rows="3"
                    placeholder="VD: Nhận phòng sớm, phòng không hút thuốc..."
                    class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-[#1ea4e9] focus:ring-2 focus:ring-blue-50 transition-all placeholder:font-medium placeholder:text-slate-300 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              class="bg-blue-50/70 border border-blue-100 p-4 rounded-2xl flex items-center gap-3"
            >
              <div
                class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm shrink-0"
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-800">Thanh toán an toàn</p>
                <p class="text-xs font-medium text-slate-500">Bảo mật chuẩn quốc tế</p>
              </div>
            </div>

            <div
              class="bg-emerald-50/70 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3"
            >
              <div
                class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm shrink-0"
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
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-800">Không phí ẩn</p>
                <p class="text-xs font-medium text-slate-500">Minh bạch giá cả</p>
              </div>
            </div>

            <div
              class="bg-fuchsia-50/70 border border-fuchsia-100 p-4 rounded-2xl flex items-center gap-3"
            >
              <div
                class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-fuchsia-500 shadow-sm shrink-0"
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
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-800">Hỗ trợ 24/7</p>
                <p class="text-xs font-medium text-slate-500">Luôn sẵn sàng giúp đỡ</p>
              </div>
            </div>
          </div>
        </div>

        <div class="relative">
          @if (data) {
            <div
              class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-6"
            >
              <div class="p-5 border-b border-slate-100 flex gap-4">
                <div class="w-20 h-20 rounded-xl bg-slate-100 shrink-0 overflow-hidden">
                  <img [src]="data.property.coverImage" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <span
                    class="text-[10px] font-black text-[#1ea4e9] uppercase tracking-wider bg-blue-50 px-1.5 py-0.5 rounded"
                    >{{ data.property.propertyType }}</span
                  >
                  <h3
                    class="text-base font-black text-slate-800 mt-1 line-clamp-1"
                    [title]="data.property.propertyName"
                  >
                    {{ data.property.propertyName }}
                  </h3>
                  <p class="text-xs font-medium text-slate-500 mt-1 line-clamp-2">
                    {{ data.property.address }}
                  </p>
                </div>
              </div>

              <div class="p-5 border-b border-slate-100 flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-[#1ea4e9]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span class="font-bold text-slate-700">{{ data.room.roomName }}</span>
              </div>

              <div class="p-5 border-b border-slate-100 flex justify-between bg-slate-50/50">
                <div>
                  <p class="text-xs font-semibold text-slate-400 mb-1">Nhận phòng</p>
                  <p class="font-black text-slate-800 text-sm">
                    {{ formatShortDate(data.checkIn) }}
                  </p>
                </div>
                <div class="flex flex-col items-center justify-center px-4">
                  <div class="w-full h-px bg-slate-200 relative flex items-center justify-center">
                    <svg
                      class="w-4 h-4 text-slate-300 absolute"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-xs font-semibold text-slate-400 mb-1">Trả phòng</p>
                  <p class="font-black text-slate-800 text-sm">
                    {{ formatShortDate(data.checkOut) }}
                  </p>
                </div>
              </div>

              <div class="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                <div
                  class="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded shadow-sm border border-slate-100"
                >
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span class="text-xs font-bold text-slate-700">{{ data.guests }} khách</span>
                </div>
                <div
                  class="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded shadow-sm border border-slate-100"
                >
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
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                  <span class="text-xs font-bold text-slate-700"
                    >{{ data.summary.totalNights }} đêm</span
                  >
                </div>
              </div>

              <div class="p-5 flex flex-col gap-3">
                <div class="flex justify-between items-center text-sm">
                  <span class="font-medium text-slate-500"
                    >Giá phòng (x{{ data.summary.totalNights }} đêm)</span
                  >
                  <span class="font-bold text-slate-700"
                    >{{ formatPrice(data.summary.totalPrice) }}đ</span
                  >
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="font-medium text-slate-500">Thuế và phí</span>
                  <span class="font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded"
                    >Đã bao gồm</span
                  >
                </div>

                <div class="w-full border-t border-dashed border-slate-200 my-1"></div>

                <div class="flex justify-between items-center mt-2">
                  <span class="font-black text-slate-800 text-lg">Tổng cộng</span>
                  <span class="text-2xl font-black text-[#1ea4e9]"
                    >{{ formatPrice(data.summary.totalPrice)
                    }}<span class="text-base underline decoration-2 underline-offset-4 ml-0.5"
                      >đ</span
                    ></span
                  >
                </div>

                <button
                  (click)="submitBooking()"
                  [disabled]="isSubmitting"
                  class="w-full mt-4 py-3.5 bg-[#50b5e9] hover:bg-[#3ca4d8] disabled:opacity-70 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wide"
                >
                  @if (isSubmitting) {
                    <div
                      class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    ></div>
                    Đang xử lý...
                  } @else {
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
                    Thanh toán ngay
                  }
                </button>
              </div>
            </div>
          } @else {
            <div class="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <p class="text-slate-500">Không tìm thấy dữ liệu đặt phòng.</p>
              <button (click)="goBack()" class="mt-4 text-[#1ea4e9] font-bold">
                Quay lại chọn phòng
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class BookingPageComponent implements OnInit {
  private router = inject(Router);
  private location = inject(Location);
  private userStore = inject(UserStore);
  private toast = inject(ToastService);
  private bookingService = inject(BookingService);

  // Biến hứng data từ màn hình trước
  data: any = null;
  isSubmitting = false; // State để quản lý loading spinner

  // Form State
  isBookingForSelf = false;
  contactInfo = {
    fullName: '',
    phone: '',
    email: '',
    specialRequest: '',
  };

  constructor() {
    // Bắt state được truyền sang từ Router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['checkoutData']) {
      this.data = navigation.extras.state['checkoutData'];
    }
  }

  ngOnInit() {
    if (!this.data) {
      alert('Phiên đặt phòng đã hết hạn hoặc không hợp lệ!');
      this.location.back();
    }
  }

  goBack() {
    this.location.back();
  }

  // LOGIC TỰ ĐỘNG ĐIỀN
  toggleAutoFill() {
    if (this.isBookingForSelf) {
      this.contactInfo.fullName = this.userStore.user()?.fullName || '';
      this.contactInfo.phone = this.userStore.user()?.phoneNumber || '';
      this.contactInfo.email = this.userStore.user()?.email || '';
    } else {
      // Xóa form nếu người dùng bỏ tick
      this.contactInfo.fullName = '';
      this.contactInfo.phone = '';
      this.contactInfo.email = '';
    }
  }

  submitBooking() {
    // Validate
    if (!this.contactInfo.fullName || !this.contactInfo.phone || !this.contactInfo.email) {
      this.toast.show('Vui lòng điền đầy đủ thông tin liên hệ (Họ tên, SĐT, Email)!', 'error');
      return;
    }

    this.isSubmitting = true; // Bật loading spinner

    // Build Payload gửi API
    const bookingPayload = {
      userId: this.userStore.user()?.userId,
      propertyId: this.data.property.propertyId,
      roomId: this.data.room.roomId,
      checkInDate: this.formatDateToYYYYMMDD(this.data.checkIn),
      checkOutDate: this.formatDateToYYYYMMDD(this.data.checkOut),
      guestCount: this.data.guests,
      contactName: this.contactInfo.fullName,
      contactPhone: this.contactInfo.phone,
      contactEmail: this.contactInfo.email,
      specialRequest: this.contactInfo.specialRequest || '',
      bookingForSelf: this.isBookingForSelf,
    };

    // Gọi API Create Booking
    this.bookingService.createBooking(bookingPayload).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        // Kiểm tra success nếu API của bạn bọc response (Tùy cấu trúc API của bạn)
        // Nếu API chỉ trả thẳng object BookingResponseDTO thì không cần check .success
        const bookingResponse = res.data || res;

        this.toast.show('Tạo đơn đặt phòng thành công!', 'success');

        // Chuyển hướng sang trang Thanh Toán sau 1 giây

        this.router.navigate(['/booking/payment'], {
          state: {
            bookingResponse: bookingResponse, // Truyền cục Response API sang
            uiData: this.data, // Truyền kèm Data cũ sang phòng khi API thiếu hình ảnh/tên
          },
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toast.show('Có lỗi xảy ra khi tạo đơn đặt phòng. Vui lòng thử lại!', 'error');
      },
    });
  }

  // --- Formatters ---
  formatPrice(price: number): string {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  formatShortDate(dateStr: string | Date): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  formatDateToYYYYMMDD(dateStr: string | Date): string {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
