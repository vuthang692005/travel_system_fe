import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-booking-payment-page',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
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
          Quay lại
        </button>
        <h1 class="text-3xl font-black text-[#0f294d] mt-6 mb-8">Thanh toán đơn hàng</h1>
      </div>

      <div class="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div class="lg:col-span-2 flex flex-col gap-6">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 class="text-lg font-black text-slate-800 flex items-center gap-2 mb-6">
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
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Phương thức thanh toán
            </h2>

            <div class="flex flex-col gap-3">
              @for (method of paymentMethods; track method.id) {
                <div
                  class="flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all"
                  [ngClass]="
                    selectedMethod === method.id
                      ? 'border-[#1ea4e9] bg-blue-50/30'
                      : 'border-slate-100 hover:border-blue-100'
                  "
                  (click)="selectedMethod = method.id"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="w-12 h-12 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden shrink-0"
                    >
                      <span class="text-[10px] font-black" [ngClass]="method.color">{{
                        method.shortName
                      }}</span>
                    </div>
                    <span class="font-semibold text-slate-700">{{ method.name }}</span>
                  </div>

                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    [ngClass]="
                      selectedMethod === method.id ? 'border-[#1ea4e9]' : 'border-slate-300'
                    "
                  >
                    @if (selectedMethod === method.id) {
                      <div class="w-2.5 h-2.5 rounded-full bg-[#1ea4e9]"></div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-2">
            <div
              class="flex justify-between items-center mb-4 text-sm font-semibold text-slate-500"
            >
              <span>Giá gốc đơn hàng</span>
              <span class="text-slate-800">{{ formatPrice(bookingData?.totalPrice) }}đ</span>
            </div>
            <div
              class="flex justify-between items-center mb-6 text-sm font-semibold text-slate-500 border-b border-dashed border-slate-200 pb-6"
            >
              <span>Tạm tính</span>
              <span class="text-slate-800">{{ formatPrice(bookingData?.totalPrice) }}đ</span>
            </div>

            <div class="flex items-end justify-between mb-6">
              <div>
                <p class="text-sm font-bold text-slate-600 mb-1">Tổng thanh toán</p>
                <p
                  class="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit"
                >
                  <svg
                    class="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Đã bao gồm thuế phí
                </p>
              </div>
              <span class="text-3xl font-black text-[#1ea4e9]"
                >{{ formatPrice(bookingData?.totalPrice)
                }}<span class="text-xl underline decoration-2 underline-offset-4 ml-1"
                  >đ</span
                ></span
              >
            </div>

            <button
              (click)="handlePaymentClick()"
              [disabled]="isProcessingPayment"
              class="w-full py-4 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-70 disabled:cursor-not-allowed text-white font-black text-lg rounded-xl transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 active:scale-95"
            >
              @if (isProcessingPayment) {
                <div
                  class="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></div>
                Đang xử lý...
              } @else {
                Thanh toán ngay
              }
            </button>
          </div>
        </div>

        <div class="relative">
          @if (bookingData) {
            <div
              class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-6"
            >
              <div class="relative h-40 w-full">
                <img [src]="uiData?.property?.coverImage" class="w-full h-full object-cover" />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                ></div>
                <div class="absolute bottom-4 left-4 right-4 text-white">
                  <div class="flex justify-between items-start mb-1">
                    <h3 class="text-lg font-black line-clamp-1">
                      {{ bookingData.propertyName || uiData?.property?.propertyName }}
                    </h3>
                    <span
                      class="text-[10px] font-bold bg-white/20 backdrop-blur px-2 py-1 rounded text-white flex items-center gap-1"
                    >
                      <svg class="w-3 h-3 text-amber-300" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                      #{{ bookingData.bookingId }}
                    </span>
                  </div>
                  <p
                    class="text-[11px] font-medium text-slate-300 line-clamp-1 flex items-center gap-1"
                  >
                    <svg
                      class="w-3 h-3 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {{ bookingData.propertyAddress || uiData?.property?.address }}
                  </p>
                </div>
              </div>

              <div
                class="p-5 border-b border-slate-100 flex justify-between items-center bg-blue-50/20"
              >
                <div class="text-center">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Nhận phòng
                  </p>
                  <p class="font-black text-[#0f294d] text-base">
                    {{ formatShortDate(bookingData.checkInDate) }}
                  </p>
                  <p class="text-xs font-semibold text-slate-500">
                    {{ getYear(bookingData.checkInDate) }}
                  </p>
                </div>

                <div class="flex-1 flex flex-col items-center justify-center px-4">
                  <span
                    class="text-[10px] font-bold text-[#1ea4e9] mb-1 bg-blue-50 px-2 py-0.5 rounded-full z-10"
                    >{{ uiData?.summary?.totalNights || 1 }} đêm</span
                  >
                  <div
                    class="w-full h-px bg-slate-200 relative flex items-center justify-between -mt-2"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  </div>
                </div>

                <div class="text-center">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Trả phòng
                  </p>
                  <p class="font-black text-[#0f294d] text-base">
                    {{ formatShortDate(bookingData.checkOutDate) }}
                  </p>
                  <p class="text-xs font-semibold text-slate-500">
                    {{ getYear(bookingData.checkOutDate) }}
                  </p>
                </div>
              </div>

              <div class="p-5 border-b border-slate-100 flex flex-col gap-4">
                <div class="flex items-start gap-3">
                  <svg
                    class="w-5 h-5 text-slate-400 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <div>
                    <p class="text-xs font-semibold text-slate-500 mb-0.5">Loại phòng</p>
                    <p class="font-bold text-slate-800">
                      {{ bookingData.roomName || uiData?.room?.roomName }}
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg
                    class="w-5 h-5 text-slate-400 shrink-0 mt-0.5"
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
                  <div>
                    <p class="text-xs font-semibold text-slate-500 mb-0.5">Khách</p>
                    <p class="font-bold text-slate-800">{{ bookingData.guestCount }} khách</p>
                  </div>
                </div>
              </div>
            </div>
          } @else {
            <div class="bg-white rounded-2xl p-8 text-center border border-slate-200">
              Đang tải dữ liệu...
            </div>
          }
        </div>
      </div>

      @if (showQRModal) {
        <div
          class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div
            class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col items-center p-8 relative"
          >
            <button
              (click)="showQRModal = false"
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 class="text-xl font-black text-slate-800 mb-2">Mã QR Thanh Toán</h3>
            <p class="text-sm font-semibold text-slate-500 mb-6 text-center">
              Sử dụng App Ngân hàng hoặc Ví điện tử để quét mã bên dưới.
            </p>

            <div
              class="w-48 h-48 bg-slate-100 border-4 border-[#1ea4e9] rounded-2xl mb-6 p-2 flex items-center justify-center relative"
            >
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=FakePaymentBookingForID123"
                class="w-full h-full object-contain"
                alt="QR Code"
              />
              <div
                class="absolute w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <span class="text-[10px] font-black text-[#1ea4e9]">PAY</span>
              </div>
            </div>

            <p class="text-lg font-black text-[#1ea4e9] mb-8">
              {{ formatPrice(bookingData?.totalPrice) }} đ
            </p>

            <button
              (click)="confirmFakePayment()"
              [disabled]="isProcessingPayment"
              class="w-full py-3.5 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-70 disabled:cursor-not-allowed text-white font-black rounded-xl transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 active:scale-95"
            >
              @if (isProcessingPayment) {
                <div
                  class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></div>
                Đang xác nhận...
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
                Tôi Đã Thanh Toán
              }
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class BookingPaymentPageComponent implements OnInit {
  private router = inject(Router);
  private location = inject(Location);
  private toast = inject(ToastService);
  private dialog = inject(MatDialog);
  private paymentService = inject(PaymentService);

  bookingData: any = null; // Data từ API Response
  uiData: any = null; // Data từ UI trang trước phòng khi API ko trả đủ

  isProcessingPayment = false;

  // Thanh toán
  paymentMethods = [
    { id: 'VNPAY', name: 'Cổng thanh toán VNPay', shortName: 'VNPay', color: 'text-blue-600' },
    { id: 'MOMO', name: 'Ví điện tử MoMo', shortName: 'MoMo', color: 'text-pink-600' },
    { id: 'ZALOPAY', name: 'Ví điện tử ZaloPay', shortName: 'Zalo', color: 'text-green-500' },
    { id: 'QR', name: 'Quét mã QR Ngân hàng', shortName: 'QR', color: 'text-[#1ea4e9]' },
  ];
  selectedMethod: string = 'QR';
  showQRModal = false;

  constructor() {
    // Hứng dữ liệu từ hàm submitBooking() truyền sang
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['bookingResponse']) {
      this.bookingData = navigation.extras.state['bookingResponse'];
      this.uiData = navigation.extras.state['uiData'];
      console.log('📦 Nhận được uiData:', this.uiData);
    }
  }

  ngOnInit() {
    if (!this.bookingData) {
      alert('Không tìm thấy thông tin đơn hàng!');
      this.location.back();
      return;
    }
  }

  goBack() {
    this.location.back();
  }

  // --- Logic Thanh toán ---
  handlePaymentClick() {
    if (this.selectedMethod === 'QR') {
      this.showQRModal = true;
    } else {
      this.processPayment();
    }
  }

  confirmFakePayment() {
    this.showQRModal = false;
    this.processPayment();
  }

  processPayment() {
    if (!this.bookingData || !this.bookingData.bookingId) return;

    this.isProcessingPayment = true; // Bật trạng thái đang thanh toán

    const bookingId = this.bookingData.bookingId;
    const method = this.selectedMethod; // VNPAY, MOMO, ZALOPAY, QR

    // Gọi API thông qua Service thay vì gọi trực tiếp HttpClient
    this.paymentService.submitPayment(bookingId, method).subscribe({
      next: (res) => {
        this.isProcessingPayment = false;

        this.showSuccessDialog(); // Gọi hàm hiển thị Dialog thành công
      },
      error: (err) => {
        this.isProcessingPayment = false;
        this.toast.show('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại!', 'error');
      },
    });
  }

  showSuccessDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true, // Bắt buộc người dùng phải bấm nút để đóng
      data: {
        title: 'Thanh toán thành công!',
        message:
          'Cảm ơn bạn đã đặt phòng. Biên lai và thông tin chi tiết đã được gửi vào email của bạn.',
        icon: 'check_circle',
        confirmText: 'Về trang chủ',
        cancelText: 'Đóng',
        confirmColor: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200', // Đổi nút xác nhận thành màu xanh lá cho đẹp
      },
    });

    // Lắng nghe sự kiện sau khi dialog đóng
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // NẾU BẤM "VỀ TRANG CHỦ" (Xác nhận - true)
        this.router.navigate(['/']);
      } else {
        // NẾU BẤM "ĐÓNG" (Hủy - false)
        // Tùy bạn quyết định, có thể cho họ ở lại trang này hoặc đá về danh sách lịch sử đặt phòng
        this.router.navigate(['/hotels']);
      }
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
    return `${d}/${m}`;
  }

  getYear(dateStr: string | Date): string {
    if (!dateStr) return '';
    return new Date(dateStr).getFullYear().toString();
  }
}
