import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SearchPayload {
  keyword: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  minPrice: number;
  maxPrice: number;
  page: number;
  size: number;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="bg-white/95 backdrop-blur-md rounded-2xl p-2 md:p-3 shadow-lg flex flex-col md:flex-row items-center gap-2 border border-white/40"
    >
      <div class="flex-1 py-2 w-full">
        <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-4"
          >Điểm đến</label
        >
        <div
          class="flex items-center gap-2 mt-0.5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 transition-colors p-4 relative group"
        >
          <svg
            class="w-5 h-5 text-slate-400 group-focus-within:text-[#1ea4e9]"
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
          <input
            type="text"
            [(ngModel)]="payload.keyword"
            placeholder="Nhập thành phố hoặc khách sạn"
            class="w-full bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-medium"
          />
        </div>
      </div>

      <div class="hidden md:block w-px h-10 bg-slate-200"></div>

      <div class="flex-[1.2] w-full relative" (click)="toggleDatePicker($event)">
        <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-4"
          >Khoảng thời gian lưu trú</label
        >
        <div
          class="flex items-center justify-between mt-0.5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 transition-colors p-4 cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <svg
              class="w-5 h-5 text-slate-400"
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
            <span class="text-sm font-semibold text-slate-800">{{ formatDisplayDate() }}</span>
          </div>
        </div>

        @if (showDatePicker) {
          <div
            class="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white p-5 rounded-3xl shadow-2xl border border-slate-100 z-50 w-[340px] origin-top animate-in fade-in zoom-in-95"
            (click)="$event.stopPropagation()"
          >
            <div class="flex items-center justify-between mb-4">
              <button
                (click)="prevMonth()"
                class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
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
              <h3 class="font-bold text-slate-800">
                Tháng {{ currentMonth.getMonth() + 1 }} năm {{ currentMonth.getFullYear() }}
              </h3>
              <button
                (click)="nextMonth()"
                class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
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
            <div class="grid grid-cols-7 mb-2">
              @for (day of weekDays; track day) {
                <div class="text-center text-[11px] font-bold text-slate-400 uppercase">
                  {{ day }}
                </div>
              }
            </div>
            <div class="grid grid-cols-7 gap-y-1">
              @for (day of calendarDays; track $index) {
                <div class="relative flex justify-center py-1">
                  @if (day) {
                    @if (isInRange(day.dateString)) {
                      <div class="absolute inset-0 bg-blue-50"></div>
                    }
                    @if (isCheckIn(day.dateString) && payload.checkOut) {
                      <div class="absolute inset-y-0 right-0 w-1/2 bg-blue-50"></div>
                    }
                    @if (isCheckOut(day.dateString)) {
                      <div class="absolute inset-y-0 left-0 w-1/2 bg-blue-50"></div>
                    }
                    <button
                      (click)="selectDate(day)"
                      [disabled]="day.isPast"
                      class="relative w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all z-10"
                      [ngClass]="{
                        'bg-[#1ea4e9] text-white font-bold shadow-md shadow-blue-500/30':
                          isCheckIn(day.dateString) || isCheckOut(day.dateString),
                        'text-slate-300 cursor-not-allowed': day.isPast,
                        'text-slate-700 hover:bg-slate-100 font-medium':
                          !day.isPast && !isCheckIn(day.dateString) && !isCheckOut(day.dateString),
                      }"
                    >
                      {{ day.dayNumber }}
                    </button>
                  }
                </div>
              }
            </div>
            <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div class="text-xs font-semibold">
                <span [ngClass]="payload.checkIn ? 'text-[#1ea4e9]' : 'text-slate-400'">{{
                  formatShortDate(payload.checkIn) || 'Nhận phòng'
                }}</span>
                <span class="mx-1 text-slate-300">-</span>
                <span [ngClass]="payload.checkOut ? 'text-rose-500' : 'text-slate-400'">{{
                  formatShortDate(payload.checkOut) || 'Trả phòng'
                }}</span>
              </div>
              <button
                (click)="showDatePicker = false"
                class="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Xong
              </button>
            </div>
          </div>
        }
      </div>

      <div class="hidden md:block w-px h-10 bg-slate-200"></div>

      <div class="flex-1 w-full relative" (click)="toggleGuestPicker($event)">
        <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-4"
          >Số lượng</label
        >
        <div
          class="flex items-center justify-between mt-0.5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 transition-colors p-4 cursor-pointer"
        >
          <span class="text-sm font-semibold text-slate-800">{{ payload.guests }} người</span>
          <svg
            class="w-4 h-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        @if (showGuestPicker) {
          <div
            class="absolute top-full right-0 md:left-0 mt-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-50 w-[250px] origin-top animate-in fade-in zoom-in-95"
            (click)="$event.stopPropagation()"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-bold text-slate-800">Số khách</p>
                <p class="text-[11px] text-slate-500">Từ 1 tuổi</p>
              </div>
              <div class="flex items-center gap-3">
                <button
                  (click)="updateGuests(-1)"
                  class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-600 font-bold"
                  [disabled]="payload.guests <= 1"
                >
                  -
                </button>
                <span class="w-4 text-center font-bold text-slate-800">{{ payload.guests }}</span>
                <button
                  (click)="updateGuests(1)"
                  class="w-8 h-8 rounded-full bg-[#1ea4e9] text-white flex items-center justify-center hover:bg-[#1891d4] font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <div class="hidden md:block w-px h-10 bg-slate-200"></div>

      <div class="flex-[1.2] w-full relative" (click)="togglePricePicker($event)">
        <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-4"
          >Mức giá</label
        >
        <div
          class="flex items-center justify-between mt-0.5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 transition-colors p-4 cursor-pointer"
        >
          <span class="text-sm font-semibold text-slate-800 truncate">{{
            formatPriceDisplay()
          }}</span>
          <svg
            class="w-4 h-4 text-slate-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        @if (showPricePicker) {
          <div
            class="absolute top-full right-0 md:left-1/2 md:-translate-x-1/2 mt-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 z-50 w-[340px] origin-top animate-in fade-in zoom-in-95"
            (click)="$event.stopPropagation()"
          >
            <h3
              class="text-[15px] font-black text-[#0f294d] flex items-center justify-center gap-2 mb-8 uppercase tracking-wide"
            >
              <span class="text-[#1ea4e9] text-xl">$</span> Khoảng giá (1 đêm)
            </h3>

            <div class="relative h-2.5 bg-slate-200 rounded-full mb-8">
              <div
                class="absolute h-full bg-[#1ea4e9] rounded-full"
                [style.left.%]="(payload.minPrice / maxSliderValue) * 100"
                [style.right.%]="100 - (payload.maxPrice / maxSliderValue) * 100"
              ></div>

              <input
                type="range"
                [min]="0"
                [max]="maxSliderValue"
                [step]="100000"
                [(ngModel)]="payload.minPrice"
                (input)="onMinPriceChange()"
                class="absolute w-full -top-1.5 h-2.5 appearance-none bg-transparent pointer-events-none slider-thumb z-20"
              />
              <input
                type="range"
                [min]="0"
                [max]="maxSliderValue"
                [step]="100000"
                [(ngModel)]="payload.maxPrice"
                (input)="onMaxPriceChange()"
                class="absolute w-full -top-1.5 h-2.5 appearance-none bg-transparent pointer-events-none slider-thumb z-20"
              />
            </div>

            <div class="flex items-center justify-between gap-3 mb-6">
              <div
                class="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-center"
              >
                <span class="text-sm font-semibold text-slate-700"
                  >{{ formatCurrency(payload.minPrice) }}đ</span
                >
              </div>
              <span class="text-slate-400 font-bold">-</span>
              <div
                class="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-center"
              >
                <span class="text-sm font-semibold text-slate-700"
                  >{{ formatCurrency(payload.maxPrice) }}đ</span
                >
              </div>
            </div>

            <div class="flex justify-between gap-2 border-t border-slate-100 pt-5">
              <button
                (click)="setPriceRange(0, 1000000)"
                class="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-[#1ea4e9] hover:text-[#1ea4e9] transition-colors"
              >
                < 1tr
              </button>
              <button
                (click)="setPriceRange(1000000, 3000000)"
                class="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-[#1ea4e9] hover:text-[#1ea4e9] transition-colors"
              >
                1-3tr
              </button>
              <button
                (click)="setPriceRange(3000000, maxSliderValue)"
                class="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-[#1ea4e9] hover:text-[#1ea4e9] transition-colors"
              >
                > 3tr
              </button>
            </div>
          </div>
        }
      </div>

      <div class="w-full md:w-auto h-full">
        <button
          (click)="onSearchClick()"
          class="w-full md:w-auto h-full min-h-[56px] px-8 bg-[#1ea4e9] hover:bg-[#0284c7] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Tìm kiếm
        </button>
      </div>
    </div>
  `,
  // CSS TÙY CHỈNH CHO SLIDER KÉO BÊN TRONG COMPONENT
  styles: [
    `
      .slider-thumb::-webkit-slider-thumb {
        pointer-events: auto;
        appearance: none;
        width: 28px;
        height: 28px;
        background: white;
        border: 4px solid #1ea4e9;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      }
      .slider-thumb::-moz-range-thumb {
        pointer-events: auto;
        width: 28px;
        height: 28px;
        background: white;
        border: 4px solid #1ea4e9;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      }
    `,
  ],
})
export class SearchBarComponent {
  // Payload đã chèn thêm minPrice, maxPrice
  payload: SearchPayload = {
    keyword: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    minPrice: 0,
    maxPrice: 10000000, // Mặc định là 10 triệu
    page: 0,
    size: 10,
  };

  maxSliderValue = 10000000; // Mức trần cho thanh kéo (10 triệu)

  @Input() set initPayload(val: Partial<SearchPayload>) {
    if (val) {
      this.payload = { ...this.payload, ...val };
      // Vì URL lưu param dưới dạng String, ta cần ép kiểu về Number cho chuẩn
      if (val.guests) this.payload.guests = Number(val.guests);
      if (val.minPrice) this.payload.minPrice = Number(val.minPrice);
      if (val.maxPrice) this.payload.maxPrice = Number(val.maxPrice);
      if (val.page) this.payload.page = Number(val.page);
      if (val.size) this.payload.size = Number(val.size);
    }
  }

  @Output() onSearch = new EventEmitter<SearchPayload>();

  showDatePicker = false;
  showGuestPicker = false;
  showPricePicker = false; // Toggle cho giá

  // Lịch & Logic
  currentMonth!: Date;
  weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  calendarDays: any[] = [];
  today = new Date();

  constructor() {
    this.today.setHours(0, 0, 0, 0);
    this.currentMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    this.generateCalendar();
  }

  // ================= LOGIC KHOẢNG GIÁ =================
  onMinPriceChange() {
    if (this.payload.minPrice > this.payload.maxPrice) {
      this.payload.minPrice = this.payload.maxPrice;
    }
  }

  onMaxPriceChange() {
    if (this.payload.maxPrice < this.payload.minPrice) {
      this.payload.maxPrice = this.payload.minPrice;
    }
  }

  setPriceRange(min: number, max: number) {
    this.payload.minPrice = min;
    this.payload.maxPrice = max;
  }

  formatCurrency(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  formatPriceDisplay(): string {
    if (this.payload.minPrice === 0 && this.payload.maxPrice === this.maxSliderValue) {
      return 'Mức giá';
    }
    return `${this.formatCurrency(this.payload.minPrice)}đ - ${this.formatCurrency(this.payload.maxPrice)}đ`;
  }

  // ================= CALENDAR LOGIC (GIỮ NGUYÊN) =================
  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    this.calendarDays = [];
    for (let i = 0; i < firstDayIndex; i++) this.calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      this.calendarDays.push({
        date: date,
        dayNumber: i,
        isPast: date < this.today,
        dateString: this.formatToYYYYMMDD(date),
      });
    }
  }

  prevMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1,
    );
    this.generateCalendar();
  }
  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1,
    );
    this.generateCalendar();
  }

  selectDate(day: any) {
    if (!day || day.isPast) return;
    const selectedDate = day.dateString;
    if (!this.payload.checkIn) this.payload.checkIn = selectedDate;
    else if (!this.payload.checkOut) {
      if (selectedDate > this.payload.checkIn) this.payload.checkOut = selectedDate;
      else this.payload.checkIn = selectedDate;
    } else {
      this.payload.checkIn = selectedDate;
      this.payload.checkOut = '';
    }
  }

  isCheckIn(dateStr: string) {
    return this.payload.checkIn === dateStr;
  }
  isCheckOut(dateStr: string) {
    return this.payload.checkOut === dateStr;
  }
  isInRange(dateStr: string) {
    return !!(
      this.payload.checkIn &&
      this.payload.checkOut &&
      dateStr > this.payload.checkIn &&
      dateStr < this.payload.checkOut
    );
  }

  formatToYYYYMMDD(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  formatShortDate(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}`;
  }

  formatDisplayDate(): string {
    if (!this.payload.checkIn && !this.payload.checkOut) return 'Chọn ngày nhận - trả';
    if (this.payload.checkIn && !this.payload.checkOut)
      return `${this.formatShortDate(this.payload.checkIn)} - Trả phòng?`;
    return `${this.formatShortDate(this.payload.checkIn)} - ${this.formatShortDate(this.payload.checkOut)}`;
  }

  updateGuests(amount: number) {
    const newVal = this.payload.guests + amount;
    if (newVal >= 1) this.payload.guests = newVal;
  }

  // ================= TOGGLE POPOVERS =================
  toggleDatePicker(event: Event) {
    event.stopPropagation();
    this.showDatePicker = !this.showDatePicker;
    this.showGuestPicker = false;
    this.showPricePicker = false;
  }

  toggleGuestPicker(event: Event) {
    event.stopPropagation();
    this.showGuestPicker = !this.showGuestPicker;
    this.showDatePicker = false;
    this.showPricePicker = false;
  }

  togglePricePicker(event: Event) {
    event.stopPropagation();
    this.showPricePicker = !this.showPricePicker;
    this.showDatePicker = false;
    this.showGuestPicker = false;
  }

  @HostListener('document:click')
  closePopovers() {
    this.showDatePicker = false;
    this.showGuestPicker = false;
    this.showPricePicker = false;
  }

  onSearchClick() {
    this.closePopovers();

    if (this.payload.checkIn && !this.payload.checkOut) {
      alert('Vui lòng chọn ngày trả phòng!');
      return;
    }

    // Clone payload ra để gửi API
    const finalPayload = { ...this.payload };

    // Nếu người dùng không kéo giá (để mặc định 0 -> 10tr), ta có thể xóa 2 trường này đi để API lấy tất cả
    if (finalPayload.minPrice === 0 && finalPayload.maxPrice === this.maxSliderValue) {
      delete (finalPayload as any).minPrice;
      delete (finalPayload as any).maxPrice;
    }

    this.onSearch.emit(finalPayload);
  }
}
