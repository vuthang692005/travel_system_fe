import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../core/services/booking.service'; // Nhớ import service
import { ToastService } from '../../core/services/toast.service'; // Nhớ import service

@Component({
  selector: 'app-hotel-detail-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (property) {
      <div class="min-h-screen bg-slate-50 pb-20 font-sans">
        <div class="bg-white border-b border-slate-200 pt-6 pb-6">
          <div class="max-w-[1200px] mx-auto px-4">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <span
                    class="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded"
                    >{{ property.propertyType }}</span
                  >
                </div>
                <h1 class="text-3xl font-black text-slate-800 mb-2">{{ property.propertyName }}</h1>
                <p class="text-sm text-slate-500 flex items-center gap-1.5">
                  <svg
                    class="w-4 h-4 text-[#1ea4e9]"
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
                  {{ property.address }}
                </p>
              </div>
              <button
                class="px-8 py-3 bg-[#1ea4e9] text-white font-bold rounded-xl hover:bg-[#0284c7] transition-colors shadow-lg shadow-blue-500/30 whitespace-nowrap h-fit"
                (click)="scrollTo('rooms')"
              >
                Đặt phòng ngay
              </button>
            </div>

            <div class="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] rounded-2xl overflow-hidden">
              @if (property.images && property.images.length > 0) {
                <div class="col-span-2 row-span-2 relative cursor-pointer group">
                  <img
                    [src]="property.images[0]"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"
                  ></div>
                </div>

                @for (img of property.images.slice(1, 5); track $index) {
                  <div class="relative cursor-pointer group">
                    <img
                      [src]="img"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"
                    ></div>

                    @if ($index === 3 && property.images.length > 5) {
                      <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span class="text-white font-bold text-lg"
                          >+{{ property.images.length - 5 }} ảnh</span
                        >
                      </div>
                    }
                  </div>
                }
              } @else {
                <div class="col-span-4 row-span-2 bg-slate-200 flex items-center justify-center">
                  <span class="text-slate-400">Không có hình ảnh</span>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm transition-all">
          <div class="max-w-[1200px] mx-auto px-4 flex gap-8">
            <button
              (click)="scrollTo('overview')"
              [class]="
                activeSection === 'overview'
                  ? 'py-4 text-[#1ea4e9] font-bold border-b-2 border-[#1ea4e9]'
                  : 'py-4 text-slate-500 font-semibold hover:text-slate-800'
              "
            >
              Tổng quan
            </button>
            <button
              (click)="scrollTo('rooms')"
              [class]="
                activeSection === 'rooms'
                  ? 'py-4 text-[#1ea4e9] font-bold border-b-2 border-[#1ea4e9]'
                  : 'py-4 text-slate-500 font-semibold hover:text-slate-800'
              "
            >
              Phòng nghỉ
            </button>
            <button
              (click)="scrollTo('policies')"
              [class]="
                activeSection === 'policies'
                  ? 'py-4 text-[#1ea4e9] font-bold border-b-2 border-[#1ea4e9]'
                  : 'py-4 text-slate-500 font-semibold hover:text-slate-800'
              "
            >
              Chính sách
            </button>
          </div>
        </div>

        <div class="max-w-[1200px] mx-auto px-4 py-8 flex flex-col gap-8">
          <div
            id="overview"
            class="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm scroll-mt-20"
          >
            <h2 class="text-xl font-black text-slate-800 mb-6">Giới thiệu</h2>

            <div
              class="prose prose-slate max-w-none text-sm leading-relaxed mb-8 whitespace-pre-line text-slate-600"
            >
              {{ property.description }}
            </div>

            <h3 class="text-lg font-black text-slate-800 mb-6">Tiện nghi & Dịch vụ nổi bật</h3>
            @if (property.amenities && property.amenities.length > 0) {
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                @for (amenity of property.amenities; track amenity.propertyAmenityId) {
                  <div
                    class="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50"
                  >
                    <div
                      class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#1ea4e9]"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span class="text-sm font-semibold text-slate-700">{{
                      getPropertyAmenityName(amenity.amenityName)
                    }}</span>
                  </div>
                }
              </div>
            } @else {
              <p class="text-sm text-slate-500 italic">Chưa cập nhật tiện nghi.</p>
            }
          </div>

          <div
            id="rooms"
            class="bg-white rounded-2xl border border-slate-200 shadow-sm scroll-mt-20 overflow-hidden"
          >
            <div class="p-6 md:p-8 border-b border-slate-100">
              <h2 class="text-xl font-black text-slate-800">
                Các loại phòng có sẵn ({{ property.rooms?.length || 0 }})
              </h2>
            </div>

            <div class="p-6 md:p-8 flex flex-col gap-6">
              @for (room of property.rooms; track room.roomId) {
                <div
                  class="border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row group"
                >
                  <div class="relative w-full md:w-[280px] h-[200px] shrink-0 bg-slate-100">
                    <img
                      [src]="room.images?.[0] || 'assets/images/default-room.jpg'"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    @if (room.images?.length > 1) {
                      <div
                        class="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm"
                      >
                        +{{ room.images.length }} ảnh
                      </div>
                    }
                  </div>

                  <div
                    class="p-5 flex-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100"
                  >
                    <div>
                      <h3 class="text-lg font-black text-[#0f294d] mb-3">{{ room.roomName }}</h3>

                      <div
                        class="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 mb-4"
                      >
                        <span class="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                          <svg
                            class="w-3.5 h-3.5 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                            />
                          </svg>
                          {{ room.area || 0 }} m²
                        </span>
                        <span
                          class="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded uppercase"
                        >
                          {{ getRoomCategoryName(room.roomCategory) }}
                        </span>
                      </div>

                      @if (room.amenities && room.amenities.length > 0) {
                        <div class="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                          @for (amenity of room.amenities; track amenity) {
                            <div
                              class="flex items-center gap-1.5 text-[13px] font-medium text-slate-600"
                            >
                              <svg
                                class="w-4 h-4 text-emerald-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2.5"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              {{ getAmenityName(amenity) }}
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </div>

                  <div
                    class="p-5 w-full md:w-[250px] flex flex-row md:flex-col justify-between items-center md:items-end shrink-0 bg-slate-50/50"
                  >
                    <div class="flex flex-col items-start md:items-end w-full">
                      <div class="flex items-center gap-1.5 text-slate-500 mb-3" title="Sức chứa">
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
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        <span class="font-bold text-lg">x{{ room.capacity }}</span>
                      </div>

                      <div
                        class="w-full flex flex-col items-start md:items-end bg-white md:bg-transparent p-3 md:p-0 rounded-xl border border-slate-100 md:border-none shadow-sm md:shadow-none"
                      >
                        <div class="flex items-baseline gap-1.5 mb-1.5">
                          <span class="text-2xl font-black text-[#1ea4e9]">{{
                            formatPrice(room.pricePerNight)
                          }}</span>
                          <span
                            class="text-sm font-bold text-[#1ea4e9] underline decoration-2 underline-offset-4"
                            >đ</span
                          >
                          <span class="text-[10px] font-medium text-slate-400 ml-1"
                            >/ ngày thường</span
                          >
                        </div>

                        <div
                          class="flex items-baseline gap-1.5 mb-1"
                          *ngIf="room.weekendPrice && room.weekendPrice !== room.pricePerNight"
                        >
                          <span class="text-[15px] font-bold text-rose-500">{{
                            formatPrice(room.weekendPrice)
                          }}</span>
                          <span
                            class="text-xs font-bold text-rose-500 underline decoration-2 underline-offset-2"
                            >đ</span
                          >
                          <span class="text-[10px] font-medium text-slate-400 ml-1"
                            >/ cuối tuần</span
                          >
                        </div>

                        <p class="text-[10px] text-slate-400 font-medium md:text-right w-full mt-1">
                          Đã bao gồm thuế & phí
                        </p>
                      </div>
                    </div>

                    <div class="flex flex-col items-end gap-1.5 w-full md:w-auto mt-4">
                      <button
                        (click)="openBookingModal(room)"
                        class="w-full px-6 py-2.5 bg-[#1ea4e9] hover:bg-[#0284c7] text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95 whitespace-nowrap"
                      >
                        Đặt phòng ngay
                      </button>
                    </div>
                  </div>
                </div>
              } @empty {
                <p class="text-center text-slate-500 py-10">
                  Cơ sở này hiện chưa có phòng nào khả dụng.
                </p>
              }
            </div>
          </div>

          <div
            id="policies"
            class="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm scroll-mt-20"
          >
            <h2 class="text-xl font-black text-slate-800 mb-6">Quy tắc chung & Chính sách</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div class="flex items-start gap-4 pb-6 border-b border-slate-100">
                <svg
                  class="w-6 h-6 text-slate-400 shrink-0 mt-0.5"
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
                <div class="flex-1">
                  <p class="font-bold text-slate-800 mb-1">Nhận/Trả phòng</p>
                  <p class="text-sm text-slate-600">
                    Nhận phòng từ: <strong>{{ property.checkInTime || '14:00' }}</strong>
                  </p>
                  <p class="text-sm text-slate-600">
                    Trả phòng đến: <strong>{{ property.checkOutTime || '12:00' }}</strong>
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4 pb-6 border-b border-slate-100">
                <svg
                  class="w-6 h-6 text-slate-400 shrink-0 mt-0.5"
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
                <div class="flex-1">
                  <p class="font-bold text-slate-800 mb-1">Hủy đổi phòng</p>
                  <p class="text-sm text-slate-600">
                    {{
                      property.allowFreeCancellation
                        ? 'Miễn phí hủy trước ' + property.freeCancellationDays + ' ngày.'
                        : 'Không hỗ trợ hủy phòng miễn phí.'
                    }}
                  </p>
                  <p class="text-sm text-slate-500 italic mt-1">
                    {{ property.cancellationPolicyDescription }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4 pb-6 border-b border-slate-100 md:border-b-0">
                <svg
                  class="w-6 h-6 text-slate-400 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <div class="flex-1">
                  <p class="font-bold text-slate-800 mb-1">Trẻ em & Tuổi</p>
                  <p class="text-sm text-slate-600">
                    Độ tuổi tối thiểu nhận phòng: <strong>{{ property.minimumAge }} tuổi</strong>
                  </p>
                  <p class="text-sm text-slate-600">
                    {{
                      property.childrenAllowed
                        ? 'Cho phép mang theo trẻ em.'
                        : 'Không phù hợp với phép trẻ em.'
                    }}
                  </p>
                  <p
                    class="text-sm text-slate-500 italic mt-1"
                    *ngIf="property.childrenPolicyDescription"
                  >
                    {{ property.childrenPolicyDescription }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4 pb-6 border-b border-slate-100 md:border-b-0">
                <svg
                  class="w-6 h-6 text-slate-400 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                  />
                </svg>
                <div class="flex-1">
                  <p class="font-bold text-slate-800 mb-1">Thú cưng & Khác</p>
                  <p class="text-sm text-slate-600">
                    {{
                      property.petsAllowed
                        ? 'Cho phép mang theo thú cưng.'
                        : 'Không cho phép thú cưng.'
                    }}
                  </p>
                  <p class="text-sm text-slate-600">
                    {{ property.smokingAllowed ? 'Cho phép hút thuốc.' : 'Cấm hút thuốc.' }}
                  </p>
                  <p class="text-sm text-slate-500 italic mt-1" *ngIf="property.quietHours">
                    Giờ giữ yên lặng: {{ property.quietHours }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div
          class="w-12 h-12 border-4 border-slate-200 border-t-[#1ea4e9] rounded-full animate-spin mb-4"
        ></div>
        <p class="text-slate-500 font-medium">Đang tải thông tin khách sạn...</p>
      </div>
    }

    @if (showBookingModal && selectedRoom) {
      <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-6 animate-in fade-in duration-200"
      >
        <div
          class="relative bg-white rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col md:flex-row h-[95vh] md:h-[650px] animate-in zoom-in-95"
          (click)="$event.stopPropagation()"
        >
          <button
            (click)="closeBookingModal()"
            class="absolute top-4 right-4 md:top-6 md:right-6 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 z-50 transition-colors"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="rounded-l-xl flex-[1.4] p-5 md:p-8 bg-slate-50 overflow-y-auto">
            <h2 class="text-xl md:text-2xl font-black text-[#0f294d] mb-6 pr-10">
              Lên lịch chuyến đi
            </h2>

            <div
              class="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 mb-6 flex items-start gap-3 text-indigo-800 text-sm font-medium"
            >
              <svg
                class="w-5 h-5 text-indigo-500 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span
                >Mẹo thông minh: Đặt phòng vào các ngày <strong>Trong tuần</strong> để tận hưởng mức
                giá ưu đãi nhất!</span
              >
            </div>

            <div
              class="bg-white border border-slate-200 rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-sm"
            >
              <div class="flex items-center gap-3 md:gap-4 mb-6">
                <div
                  class="flex-1 border-2 rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 text-center cursor-pointer transition-colors"
                  [ngClass]="
                    selectingDate === 'checkIn'
                      ? 'border-[#1ea4e9] bg-blue-50/50'
                      : 'border-slate-100 hover:border-slate-300'
                  "
                  (click)="selectingDate = 'checkIn'"
                >
                  <span class="text-[10px] md:text-xs font-bold text-slate-400 block mb-0.5"
                    >NHẬN PHÒNG</span
                  >
                  <span
                    class="text-sm md:text-base font-black"
                    [ngClass]="bookingCheckIn ? 'text-[#0f294d]' : 'text-slate-300'"
                    >{{ formatDisplayDate(bookingCheckIn) || 'Chọn ngày' }}</span
                  >
                </div>
                <div
                  class="flex-1 border-2 rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 text-center cursor-pointer transition-colors"
                  [ngClass]="
                    selectingDate === 'checkOut'
                      ? 'border-[#1ea4e9] bg-blue-50/50'
                      : 'border-slate-100 hover:border-slate-300'
                  "
                  (click)="selectingDate = 'checkOut'"
                >
                  <span class="text-[10px] md:text-xs font-bold text-slate-400 block mb-0.5"
                    >TRẢ PHÒNG</span
                  >
                  <span
                    class="text-sm md:text-base font-black"
                    [ngClass]="bookingCheckOut ? 'text-[#0f294d]' : 'text-slate-300'"
                    >{{ formatDisplayDate(bookingCheckOut) || 'Chọn ngày' }}</span
                  >
                </div>
              </div>

              <div class="flex items-center justify-between mb-4 px-2">
                <button
                  (click)="prevModalMonth()"
                  class="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span class="font-black text-slate-800 text-base md:text-lg"
                  >Tháng {{ modalCurrentMonth.getMonth() + 1 }} -
                  {{ modalCurrentMonth.getFullYear() }}</span
                >
                <button
                  (click)="nextModalMonth()"
                  class="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div
                class="grid grid-cols-7 mb-3 text-center text-xs font-bold text-slate-400 uppercase"
              >
                <div>CN</div>
                <div>T2</div>
                <div>T3</div>
                <div>T4</div>
                <div>T5</div>
                <div>T6</div>
                <div>T7</div>
              </div>

              <div class="grid grid-cols-7 gap-y-2">
                @for (day of modalCalendarDays; track $index) {
                  <div class="relative flex justify-center py-1">
                    @if (day) {
                      @if (isInBookingRange(day.date)) {
                        <div class="absolute inset-0 bg-blue-50"></div>
                      }
                      @if (isBookingCheckIn(day.date) && bookingCheckOut) {
                        <div class="absolute inset-y-0 right-0 w-1/2 bg-blue-50"></div>
                      }
                      @if (isBookingCheckOut(day.date)) {
                        <div class="absolute inset-y-0 left-0 w-1/2 bg-blue-50"></div>
                      }

                      <button
                        (click)="selectBookingDate(day.date)"
                        [disabled]="day.isPast || isDateBooked(day.date)"
                        class="relative w-8 h-8 md:w-10 md:h-10 rounded-full text-sm transition-all z-10 font-bold disabled:cursor-not-allowed"
                        [ngClass]="
                          day.isPast
                            ? 'text-slate-300'
                            : isDateBooked(day.date)
                              ? 'text-slate-300 bg-slate-100 line-through decoration-slate-400'
                              : getBookingDayClass(day.date)
                        "
                      >
                        {{ day.dayNumber }}
                      </button>
                    }
                  </div>
                }
              </div>
            </div>
          </div>

          <div
            class="rounded-r-xl flex-1 bg-white p-5 md:p-8 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col overflow-y-auto"
          >
            <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Thời gian lưu trú
            </h3>
            <div
              class="bg-slate-50 border border-slate-100 rounded-2xl md:rounded-3xl p-4 md:p-5 mb-6 md:mb-8 relative shrink-0"
            >
              <div class="flex justify-between items-start mb-5 md:mb-6">
                <div class="flex items-center gap-3 md:gap-4">
                  <div
                    class="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-[#1ea4e9] shrink-0"
                  >
                    <svg
                      class="w-5 h-5 md:w-6 md:h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase mb-0.5">
                      Nhận phòng
                    </p>
                    <p class="font-black text-slate-800 text-sm md:text-[15px]">
                      {{ formatDisplayDate(bookingCheckIn) || '--/--/----' }}
                    </p>
                    <p class="text-[11px] md:text-xs font-semibold text-slate-500 mt-0.5">
                      Từ {{ property.checkInTime || '14:00' }}
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="absolute left-[35px] md:left-[43px] top-[60px] md:top-[70px] bottom-[60px] md:bottom-[70px] w-[2px] bg-slate-200"
              ></div>

              <div class="flex justify-between items-start">
                <div class="flex items-center gap-3 md:gap-4">
                  <div
                    class="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-rose-500 shrink-0"
                  >
                    <svg
                      class="w-5 h-5 md:w-6 md:h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase mb-0.5">
                      Trả phòng
                    </p>
                    <p class="font-black text-slate-800 text-sm md:text-[15px]">
                      {{ formatDisplayDate(bookingCheckOut) || '--/--/----' }}
                    </p>
                    <p class="text-[11px] md:text-xs font-semibold text-slate-500 mt-0.5">
                      Trước {{ property.checkOutTime || '12:00' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Chi tiết thanh toán
            </h3>

            <div class="flex-1 flex flex-col">
              @if (bookingSummary) {
                <div class="space-y-3 mb-4 border-b border-dashed border-slate-200 pb-4">
                  @if (bookingSummary.weekdayNights > 0) {
                    <div class="flex justify-between items-center text-sm md:text-base">
                      <span class="text-slate-600 font-medium"
                        >Ngày thường
                        <span class="text-xs text-slate-400 hidden md:inline"
                          >({{ formatPrice(selectedRoom.pricePerNight) }}đ)</span
                        ></span
                      >
                      <span class="font-black text-slate-800"
                        >x {{ bookingSummary.weekdayNights }} đêm</span
                      >
                    </div>
                  }

                  @if (bookingSummary.weekendNights > 0) {
                    <div class="flex justify-between items-center text-sm md:text-base">
                      <span class="text-slate-600 font-medium flex items-center gap-1">
                        Cuối tuần <span class="w-2 h-2 rounded-full bg-rose-400"></span>
                        <span class="text-xs text-slate-400 hidden md:inline"
                          >({{
                            formatPrice(selectedRoom.weekendPrice || selectedRoom.pricePerNight)
                          }}đ)</span
                        >
                      </span>
                      <span class="font-black text-slate-800"
                        >x {{ bookingSummary.weekendNights }} đêm</span
                      >
                    </div>
                  }

                  <div
                    class="flex justify-between items-center font-black text-slate-800 pt-3 border-t border-slate-100"
                  >
                    <span>Tổng số đêm</span>
                    <span class="text-[#1ea4e9]">{{ bookingSummary.totalNights }} đêm</span>
                  </div>
                </div>

                <div class="flex items-end justify-between mt-auto pt-2">
                  <span class="font-black text-slate-800 text-base md:text-lg mb-1"
                    >Tổng tạm tính</span
                  >
                  <div class="text-right">
                    <div class="text-2xl md:text-3xl font-black text-[#1ea4e9]">
                      {{ formatPrice(bookingSummary.totalPrice)
                      }}<span
                        class="text-lg md:text-xl underline decoration-2 underline-offset-4 ml-1"
                        >đ</span
                      >
                    </div>
                  </div>
                </div>
                <p class="text-[10px] font-bold text-slate-400 text-right mb-5 mt-1">
                  * Giá đã bao gồm thuế & phí
                </p>
              } @else {
                <div
                  class="h-full min-h-[150px] flex flex-col items-center justify-center text-center pb-4"
                >
                  <div
                    class="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3"
                  >
                    <svg
                      class="w-6 h-6 md:w-8 md:h-8 text-slate-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"
                      />
                    </svg>
                  </div>
                  <p class="text-slate-400 font-semibold text-xs md:text-sm">
                    Vui lòng chọn đủ<br />ngày nhận và trả phòng.
                  </p>
                </div>
              }

              <button
                (click)="goToBooking()"
                class="w-full py-3 md:py-4 bg-[#1ea4e9] hover:bg-[#0284c7] text-white font-black text-base md:text-lg rounded-xl md:rounded-2xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95 mt-auto shrink-0"
                [disabled]="!bookingSummary"
                [class.opacity-50]="!bookingSummary"
                [class.cursor-not-allowed]="!bookingSummary"
              >
                <svg
                  class="w-5 h-5 md:w-6 md:h-6"
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
                Xác nhận đặt phòng
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class HotelDetailPageComponent implements OnInit {
  property: any = null;
  activeSection: string = 'overview';
  showBookingModal = false;
  selectedRoom: any = null;
  bookingCheckIn: Date | null = null;
  bookingCheckOut: Date | null = null;
  selectingDate: 'checkIn' | 'checkOut' = 'checkIn';
  searchCriteria: any = null;

  today = new Date();
  modalCurrentMonth!: Date;
  modalCalendarDays: any[] = [];
  bookedRanges: { start: Date; end: Date }[] = [];

  private router = inject(Router);
  private toast = inject(ToastService);
  private bookingService = inject(BookingService);

  constructor() {
    // Lấy dữ liệu property được truyền từ trang Search qua Router State
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['propertyData']) {
      this.property = navigation.extras.state['propertyData'];
    }
    const state = navigation?.extras.state as any;

    if (state) {
      this.searchCriteria = state.searchCriteria; // Lấy guests, keyword... từ đây
    }
  }

  ngOnInit() {
    if (!this.property) {
      // NẾU KHÔNG CÓ DATA TỪ STATE (ví dụ user copy link gửi cho bạn bè):
      // TODO: Viết logic lấy ID từ URL (ActivatedRoute) và gọi API getHotelById ở đây
      console.warn('Không tìm thấy dữ liệu trong state, cần gọi API để lấy data!');
    }
  }

  // --- LOGIC CUỘN TRANG (SMOOTH SCROLL) ---
  scrollTo(elementId: string): void {
    this.activeSection = elementId;
    const element = document.getElementById(elementId);
    if (element) {
      // Tính toán vị trí trừ đi độ cao của sticky header (khoảng 80px)
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  getRoomCategoryName(category: string): string {
    const categoryMap: { [key: string]: string } = {
      STANDARD: 'Phòng Tiêu Chuẩn',
      DELUXE: 'Phòng Cao Cấp',
      SUITE: 'Phòng Suite',
      WHOLE: 'Nguyên Căn',
    };
    // Nếu có trong map thì trả về tiếng Việt, không thì trả về chữ gốc
    return categoryMap[category] || category;
  }

  // --- FORMATTER ---
  formatPrice(price: number): string {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Hàm dịch tiện ích phòng sang tiếng Việt
  getAmenityName(code: string): string {
    const amenityMap: { [key: string]: string } = {
      tv: 'Tivi màn hình phẳng',
      ac: 'Điều hòa không khí',
      minibar: 'Minibar',
      tea_coffee: 'Máy pha trà/cà phê',
      wifi: 'Wifi tốc độ cao',
      bathtub: 'Bồn tắm',
      balcony: 'Ban công',
      non_smoking: 'Phòng không hút thuốc',
    };
    return amenityMap[code] || code; // Trả về code gốc nếu không có trong map
  }

  // Hàm dịch tiện ích TỔNG của cơ sở lưu trú
  getPropertyAmenityName(code: string): string {
    const propertyAmenityMap: { [key: string]: string } = {
      pool: 'Hồ bơi',
      parking: 'Bãi đỗ xe',
      sauna: 'Phòng xông hơi',
      spa: 'Spa & Massage',
      non_smoking: 'Không hút thuốc',
      wifi: 'Wi-Fi (miễn phí)',
      airport_transfer: 'Đưa đón sân bay',
      pets: 'Cho phép thú cưng',
      gym: 'Trung tâm thể dục',
      smoking_area: 'Khu vực hút thuốc',
      reception_24h: 'Lễ tân 24h',
      ac: 'Điều hòa không khí',
    };
    return propertyAmenityMap[code.toLowerCase()] || code;
  }

  openBookingModal(room: any) {
    this.selectedRoom = room;
    this.showBookingModal = true;

    // Khởi tạo lịch
    this.today.setHours(0, 0, 0, 0);
    this.modalCurrentMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    this.generateModalCalendar();

    // Reset lựa chọn
    this.bookingCheckIn = null;
    this.bookingCheckOut = null;
    this.selectingDate = 'checkIn';
    this.bookedRanges = []; // Reset dữ liệu cũ

    // GỌI API LẤY NGÀY BẬN
    this.bookingService.getRoomAvailability(room.roomId).subscribe({
      next: (res) => {
        // Giả sử API trả về trực tiếp mảng (hoặc res.data tùy cấu trúc response của bạn)
        const ranges = res.data || res || [];

        // Chuyển chuỗi sang Date object để so sánh cho dễ
        this.bookedRanges = ranges.map((r: any) => {
          const startDate = new Date(r.start);
          startDate.setHours(0, 0, 0, 0);

          const endDate = new Date(r.end);
          endDate.setHours(0, 0, 0, 0);

          return { start: startDate, end: endDate };
        });
      },
      error: (err) => console.error('Lỗi lấy ngày bận:', err),
    });
  }

  isDateBooked(date: Date): boolean {
    if (!date || !this.bookedRanges.length) return false;

    const time = date.getTime();
    return this.bookedRanges.some((range) => {
      // Một ngày được coi là bận nếu nó nằm từ CheckIn đến (trước ngày CheckOut)
      // Khách A trả phòng sáng ngày 5, thì chiều ngày 5 khách B vẫn vào nhận phòng được -> Ngày 5 KHÔNG bận hoàn toàn.
      // Do đó, ta chỉ block các ngày (Start <= Date < End).
      // Lưu ý: Nếu quy định kinh doanh của bạn là block cả ngày End, hãy sửa thành `time <= range.end.getTime()`
      return time >= range.start.getTime() && time < range.end.getTime();
    });
  }

  // Kiểm tra xem dải ngày từ [start -> end] có chứa ngày bận nào ở giữa không
  hasBookedDateInRange(start: Date, end: Date): boolean {
    if (!start || !end || !this.bookedRanges.length) return false;

    const startTime = start.getTime();
    const endTime = end.getTime();

    // Duyệt qua từng dải bận
    return this.bookedRanges.some((range) => {
      const rangeStart = range.start.getTime();
      const rangeEnd = range.end.getTime();

      // Nếu dải bận rơi trọn vào giữa khoảng chọn, hoặc cắt ngang khoảng chọn
      return (
        (rangeStart > startTime && rangeStart < endTime) ||
        (rangeEnd > startTime && rangeEnd < endTime)
      );
    });
  }

  closeBookingModal() {
    this.showBookingModal = false;
    this.selectedRoom = null;
  }

  // ================= LOGIC TÍNH TỔNG TIỀN (AUTO) =================
  get bookingSummary() {
    if (!this.bookingCheckIn || !this.bookingCheckOut || !this.selectedRoom) return null;

    let totalNights = 0;
    let weekdayNights = 0;
    let weekendNights = 0;

    let current = new Date(this.bookingCheckIn);
    const end = new Date(this.bookingCheckOut);

    // Tính toán đếm từng đêm một
    while (current < end) {
      totalNights++;
      const day = current.getDay(); // 0: Chủ Nhật, 1: Thứ 2, ... 5: Thứ 6, 6: Thứ 7

      // Ở ngành KS, đêm T6 và đêm T7 thường tính là giá cuối tuần
      if (day === 5 || day === 6) {
        weekendNights++;
      } else {
        weekdayNights++;
      }
      current.setDate(current.getDate() + 1);
    }

    const priceNormal = this.selectedRoom.pricePerNight || 0;
    const priceWeekend = this.selectedRoom.weekendPrice || priceNormal;

    const weekdayTotal = weekdayNights * priceNormal;
    const weekendTotal = weekendNights * priceWeekend;

    return {
      totalNights,
      weekdayNights,
      weekendNights,
      totalPrice: weekdayTotal + weekendTotal,
    };
  }

  // ================= LOGIC LỊCH (TRONG MODAL) =================
  generateModalCalendar() {
    const year = this.modalCurrentMonth.getFullYear();
    const month = this.modalCurrentMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.modalCalendarDays = [];
    for (let i = 0; i < firstDayIndex; i++) this.modalCalendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      date.setHours(0, 0, 0, 0);
      this.modalCalendarDays.push({ date: date, dayNumber: i, isPast: date < this.today });
    }
  }

  prevModalMonth() {
    this.modalCurrentMonth = new Date(
      this.modalCurrentMonth.getFullYear(),
      this.modalCurrentMonth.getMonth() - 1,
      1,
    );
    this.generateModalCalendar();
  }

  nextModalMonth() {
    this.modalCurrentMonth = new Date(
      this.modalCurrentMonth.getFullYear(),
      this.modalCurrentMonth.getMonth() + 1,
      1,
    );
    this.generateModalCalendar();
  }

  selectBookingDate(date: Date) {
    if (this.isDateBooked(date)) return; // Chặn cứng nếu click vào ngày bận

    if (this.selectingDate === 'checkIn') {
      this.bookingCheckIn = date;
      if (this.bookingCheckOut && date >= this.bookingCheckOut) {
        this.bookingCheckOut = null;
      }
      this.selectingDate = 'checkOut';
    } else {
      if (this.bookingCheckIn && date <= this.bookingCheckIn) {
        this.bookingCheckIn = date;
        this.bookingCheckOut = null;
      } else {
        // KIỂM TRA QUAN TRỌNG: Nếu từ CheckIn tới CheckOut có chứa ngày bận -> Chặn!
        if (this.bookingCheckIn && this.hasBookedDateInRange(this.bookingCheckIn, date)) {
          this.toast.show(
            'Khoảng thời gian bạn chọn chứa những ngày đã được đặt. Vui lòng chọn lại!',
          );
          this.bookingCheckOut = null;
          return; // Không cho phép chọn
        }

        this.bookingCheckOut = date;
        this.selectingDate = 'checkIn';
      }
    }
  }

  // --- Helpers Vẽ Lịch ---
  isBookingCheckIn(date: Date) {
    return this.bookingCheckIn?.getTime() === date.getTime();
  }
  isBookingCheckOut(date: Date) {
    return this.bookingCheckOut?.getTime() === date.getTime();
  }

  isInBookingRange(date: Date) {
    if (!this.bookingCheckIn || !this.bookingCheckOut) return false;
    return date > this.bookingCheckIn && date < this.bookingCheckOut;
  }

  getBookingDayClass(date: Date) {
    if (this.isBookingCheckIn(date) || this.isBookingCheckOut(date)) {
      return 'bg-[#1ea4e9] text-white shadow-lg shadow-blue-500/40 font-black';
    }
    if (this.isInBookingRange(date)) return 'bg-transparent text-[#0f294d] font-bold';
    return 'bg-transparent text-slate-700 hover:bg-slate-200';
  }

  formatDisplayDate(date: Date | null): string {
    if (!date) return '';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${d}/${m}/${date.getFullYear()}`;
  }

  goToBooking() {
    if (!this.bookingSummary) return;

    // Đóng modal cho gọn
    this.showBookingModal = false;

    // Gói toàn bộ dữ liệu mang sang trang thanh toán
    const checkoutData = {
      property: this.property,
      room: this.selectedRoom,
      summary: this.bookingSummary,
      checkIn: this.bookingCheckIn,
      checkOut: this.bookingCheckOut,
      guests: this.searchCriteria?.guests || 2,
    };

    // Chuyển hướng sang /booking và mang theo state
    this.router.navigate(['/booking'], { state: { checkoutData } });
  }
}
