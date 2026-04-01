import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-property-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm transition-opacity flex items-center justify-center p-4 md:p-6"
    >
      <div
        class="w-full max-w-5xl bg-slate-50 rounded-2xl max-h-[95vh] shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden relative"
      >
        <div
          class="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0"
        >
          <div>
            <h2 class="text-xl font-black text-slate-800">Chi tiết Hồ sơ đăng ký</h2>
            <p class="text-sm text-slate-500 font-medium mt-1">
              Mã cơ sở: #{{ property?.propertyId }}
            </p>
          </div>
          <button
            (click)="onClose.emit()"
            class="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg
                class="w-5 h-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Thông tin đối tác
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-xs text-slate-500 font-semibold uppercase block mb-1"
                  >Họ và tên</span
                >
                <span class="text-sm font-bold text-slate-800">{{
                  property?.ownerName || 'Chưa cập nhật'
                }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-xs text-slate-500 font-semibold uppercase block mb-1"
                  >Số điện thoại</span
                >
                <span class="text-sm font-bold text-slate-800">{{
                  property?.phoneContact || 'Chưa cập nhật'
                }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-xs text-slate-500 font-semibold uppercase block mb-1"
                  >Email liên hệ</span
                >
                <span class="text-sm font-bold text-slate-800">{{
                  property?.emailContact || 'Chưa cập nhật'
                }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Thông tin cơ sở lưu trú
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-xs text-slate-500 font-semibold uppercase block mb-1"
                  >Tên cơ sở</span
                >
                <span class="text-sm font-bold text-slate-800">{{ property?.propertyName }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-xs text-slate-500 font-semibold uppercase block mb-1"
                  >Loại hình</span
                >
                <span class="text-sm font-bold text-[#1ea4e9] bg-blue-50 px-2 py-0.5 rounded">{{
                  property?.propertyType
                }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 md:col-span-2">
                <span class="text-xs text-slate-500 font-semibold uppercase block mb-1"
                  >Diện tích</span
                >
                <span class="text-sm font-bold text-slate-800">{{
                  property?.area ? property.area + ' m²' : 'Chưa cập nhật'
                }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 md:col-span-2">
                <span class="text-xs text-slate-500 font-semibold uppercase block mb-1"
                  >Mô tả chi tiết</span
                >
                <p class="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {{ property?.description || 'Không có mô tả' }}
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <span class="text-xs text-slate-500 font-semibold uppercase block"
                >Hình ảnh cơ sở ({{ property?.images?.length || 0 }})</span
              >
              @if (property?.images && property.images.length > 0) {
                <div class="grid grid-cols-3 md:grid-cols-5 gap-3">
                  @for (img of property.images; track $index) {
                    <img
                      [src]="img"
                      class="aspect-square object-cover rounded-lg border border-slate-200 hover:scale-105 transition-transform cursor-pointer"
                      alt="Property Image"
                    />
                  }
                </div>
              } @else {
                <div
                  class="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-sm"
                >
                  Chưa có hình ảnh nào được tải lên.
                </div>
              }
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg
                class="w-5 h-5 text-rose-500"
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
              Vị trí & Địa chỉ
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 md:col-span-3">
                <span class="text-xs text-slate-500 font-semibold uppercase block mb-1"
                  >Địa chỉ chi tiết</span
                >
                <span class="text-sm font-bold text-slate-800">{{ property?.address }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-xs text-slate-500 font-semibold uppercase block mb-1"
                  >Phường/Xã</span
                >
                <span class="text-sm font-bold text-slate-800">{{ property?.ward || '-' }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-xs text-slate-500 font-semibold uppercase block mb-1"
                  >Quận/Huyện</span
                >
                <span class="text-sm font-bold text-slate-800">{{ property?.city || '-' }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-xs text-slate-500 font-semibold uppercase block mb-1"
                  >Tỉnh/Thành phố</span
                >
                <span class="text-sm font-bold text-slate-800">{{
                  property?.province || '-'
                }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-xs text-slate-500 font-semibold uppercase block mb-1"
                  >Quốc gia</span
                >
                <span class="text-sm font-bold text-slate-800">{{ property?.country || '-' }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 md:col-span-2">
                <span class="text-xs text-slate-500 font-semibold uppercase block mb-1"
                  >Tọa độ Bản đồ (Lat, Lng)</span
                >
                <span class="text-sm font-bold text-slate-800 font-mono"
                  >{{ property?.latitude || 'N/A' }}, {{ property?.longitude || 'N/A' }}</span
                >
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg
                class="w-5 h-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Chính sách & Quy định khách sạn
            </h3>

            <div class="space-y-6">
              <div>
                <h4 class="text-sm font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">
                  Thời gian lưu trú
                </h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span class="text-[11px] text-slate-500 font-semibold uppercase block mb-1"
                      >Nhận phòng (Từ)</span
                    >
                    <span class="text-sm font-bold text-slate-800">{{
                      property?.checkInTime || '-'
                    }}</span>
                  </div>
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span class="text-[11px] text-slate-500 font-semibold uppercase block mb-1"
                      >Trả phòng (Tới)</span
                    >
                    <span class="text-sm font-bold text-slate-800">{{
                      property?.checkOutTime || '-'
                    }}</span>
                  </div>
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span class="text-[11px] text-slate-500 font-semibold uppercase block mb-1"
                      >Giờ yên tĩnh</span
                    >
                    <span class="text-sm font-bold text-slate-800">{{
                      property?.quietHours || 'Không có'
                    }}</span>
                  </div>
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span class="text-[11px] text-slate-500 font-semibold uppercase block mb-1"
                      >Tuổi tối thiểu</span
                    >
                    <span class="text-sm font-bold text-slate-800"
                      >{{ property?.minimumAge || 0 }} tuổi</span
                    >
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">
                  Nội quy cư trú
                </h4>
                <div class="grid grid-cols-1 gap-3">
                  <div
                    class="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div
                      class="mt-0.5"
                      [ngClass]="property?.smokingAllowed ? 'text-emerald-500' : 'text-rose-500'"
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
                          [attr.d]="
                            property?.smokingAllowed ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'
                          "
                        />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-slate-800">
                        Hút thuốc: {{ property?.smokingAllowed ? 'Được phép' : 'Không cho phép' }}
                      </p>
                      @if (property?.smokingPolicyDescription) {
                        <p class="text-xs text-slate-500 mt-1">
                          {{ property.smokingPolicyDescription }}
                        </p>
                      }
                    </div>
                  </div>

                  <div
                    class="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div
                      class="mt-0.5"
                      [ngClass]="property?.petsAllowed ? 'text-emerald-500' : 'text-rose-500'"
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
                          [attr.d]="
                            property?.petsAllowed ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'
                          "
                        />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-slate-800">
                        Thú cưng: {{ property?.petsAllowed ? 'Được phép' : 'Không cho phép' }}
                      </p>
                      @if (property?.petPolicyDescription) {
                        <p class="text-xs text-slate-500 mt-1">
                          {{ property.petPolicyDescription }}
                        </p>
                      }
                    </div>
                  </div>

                  <div
                    class="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div
                      class="mt-0.5"
                      [ngClass]="property?.childrenAllowed ? 'text-emerald-500' : 'text-rose-500'"
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
                          [attr.d]="
                            property?.childrenAllowed ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'
                          "
                        />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-slate-800">
                        Trẻ em: {{ property?.childrenAllowed ? 'Phù hợp' : 'Không phù hợp' }}
                      </p>
                      @if (property?.childrenPolicyDescription) {
                        <p class="text-xs text-slate-500 mt-1">
                          {{ property.childrenPolicyDescription }}
                        </p>
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">
                  Tài chính & Hủy phòng
                </h4>
                <div class="grid grid-cols-1 gap-3">
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p class="text-sm font-bold text-slate-800 mb-1">
                      Hủy miễn phí:
                      <span
                        [ngClass]="
                          property?.allowFreeCancellation ? 'text-emerald-600' : 'text-rose-600'
                        "
                        >{{ property?.allowFreeCancellation ? 'Có' : 'Không' }}</span
                      >
                    </p>
                    @if (property?.allowFreeCancellation) {
                      <p class="text-xs text-slate-600">
                        Hủy trước:
                        <span class="font-bold">{{ property.freeCancellationDays }} ngày</span>
                      </p>
                    }
                    @if (property?.cancellationPolicyDescription) {
                      <p class="text-xs text-slate-500 mt-1">
                        {{ property.cancellationPolicyDescription }}
                      </p>
                    }
                  </div>

                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p class="text-sm font-bold text-slate-800 mb-1">
                      Thanh toán trả trước:
                      <span
                        [ngClass]="
                          property?.requiresPrepayment ? 'text-amber-600' : 'text-slate-600'
                        "
                        >{{ property?.requiresPrepayment ? 'Bắt buộc' : 'Không yêu cầu' }}</span
                      >
                    </p>
                    @if (property?.requiresPrepayment && property?.prepaymentPolicy) {
                      <p class="text-xs text-slate-500 mt-1">{{ property.prepaymentPolicy }}</p>
                    }
                  </div>

                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p class="text-sm font-bold text-slate-800 mb-1">
                      Đặt cọc hư hại:
                      <span
                        [ngClass]="
                          property?.securityDepositRequired ? 'text-amber-600' : 'text-slate-600'
                        "
                        >{{
                          property?.securityDepositRequired ? 'Bắt buộc' : 'Không yêu cầu'
                        }}</span
                      >
                    </p>
                    @if (property?.securityDepositRequired) {
                      <p class="text-xs text-slate-600">
                        Số tiền:
                        <span class="font-bold"
                          >{{ property.securityDepositAmount | number }} VNĐ</span
                        >
                      </p>
                      @if (property?.securityDepositDescription) {
                        <p class="text-xs text-slate-500 mt-1">
                          {{ property.securityDepositDescription }}
                        </p>
                      }
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        @if (property?.propertyStatus === 'PENDING') {
          <div
            class="bg-white p-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0"
          >
            <button
              (click)="onReject.emit(property?.propertyId)"
              class="px-6 py-2.5 rounded-xl border-2 border-rose-500 text-rose-500 font-bold hover:bg-rose-50 transition-colors shadow-sm"
            >
              Từ chối hồ sơ
            </button>

            <button
              (click)="onApprove.emit(property?.propertyId)"
              class="px-8 py-2.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors shadow-sm flex items-center gap-2"
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Duyệt hồ sơ
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #cbd5e1;
        border-radius: 20px;
      }
    `,
  ],
})
export class AdminPropertyDetailComponent {
  @Input() property: any = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onApprove = new EventEmitter<number>();
  @Output() onReject = new EventEmitter<number>();
}
