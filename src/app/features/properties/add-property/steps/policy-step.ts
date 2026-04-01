import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-policy-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
      [formGroup]="group"
    >
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Quy định & Chính sách</h2>
        <p class="text-slate-500 text-sm mt-1.5">
          Thiết lập các quy tắc rõ ràng để khách hàng nắm được trước khi đặt phòng.
        </p>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-1 h-5 bg-blue-500 rounded-full"></div>
          <h3 class="text-lg font-bold text-slate-800">Thời gian lưu trú</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-2">
            <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
              <svg
                class="w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Giờ nhận phòng (Check-in) *
            </label>
            <select
              formControlName="checkInTime"
              class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-700 transition-all cursor-pointer appearance-none"
            >
              <option value="" disabled selected>Chọn giờ nhận phòng</option>
              @for (time of timeOptions; track time) {
                <option [value]="time">{{ time }}</option>
              }
            </select>
          </div>

          <div class="flex flex-col gap-2">
            <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
              <svg
                class="w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Giờ trả phòng (Check-out) *
            </label>
            <select
              formControlName="checkOutTime"
              class="w-full p-3.5 bg-slate-50 border rounded-xl focus:bg-white focus:ring-4 outline-none text-slate-700 transition-all cursor-pointer appearance-none"
              [ngClass]="
                isTimeInvalid
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
              "
            >
              <option value="" disabled selected>Chọn giờ trả phòng</option>
              @for (time of timeOptions; track time) {
                <option [value]="time">{{ time }}</option>
              }
            </select>
            @if (isTimeInvalid) {
              <span class="text-xs text-red-500 font-medium"
                >Giờ trả phòng nên sau giờ nhận phòng.</span
              >
            }
          </div>

          <div class="flex flex-col gap-2 md:col-span-2">
            <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
              <svg
                class="w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              Khung giờ yên tĩnh
            </label>
            <input
              type="text"
              formControlName="quietHours"
              placeholder="VD: 22:00 - 07:00"
              class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-700 transition-all"
            />
          </div>

          <div class="flex flex-col gap-2 md:col-span-2">
            <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
              <svg
                class="w-4 h-4 text-slate-400"
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
              Độ tuổi tối thiểu nhận phòng
            </label>
            <input
              type="number"
              formControlName="minimumAge"
              placeholder="VD: 18"
              class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-700 transition-all"
            />
          </div>
        </div>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-1 h-5 bg-slate-400 rounded-full"></div>
          <h3 class="text-lg font-bold text-slate-800">Quy định cư trú</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div class="flex flex-col gap-3">
            <label
              class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all"
              [ngClass]="
                group.get('smokingAllowed')?.value
                  ? 'border-blue-400 bg-blue-50/30'
                  : 'border-slate-200 hover:bg-slate-50'
              "
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg
                    class="w-4 h-4 text-slate-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <span class="text-sm font-bold text-slate-800">Cho phép hút thuốc</span>
              </div>
              <div class="relative inline-flex items-center">
                <input type="checkbox" formControlName="smokingAllowed" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
                ></div>
              </div>
            </label>
            @if (group.get('smokingAllowed')?.value) {
              <div class="animate-in fade-in slide-in-from-top-2">
                <textarea
                  formControlName="smokingPolicyDescription"
                  rows="2"
                  placeholder="VD: Chỉ được hút thuốc ở khu vực ban công..."
                  class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-700 text-sm resize-none transition-all"
                ></textarea>
              </div>
            }
          </div>

          <div class="flex flex-col gap-3">
            <label
              class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all"
              [ngClass]="
                group.get('petsAllowed')?.value
                  ? 'border-blue-400 bg-blue-50/30'
                  : 'border-slate-200 hover:bg-slate-50'
              "
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg
                    class="w-4 h-4 text-slate-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <span class="text-sm font-bold text-slate-800">Cho phép thú cưng</span>
              </div>
              <div class="relative inline-flex items-center">
                <input type="checkbox" formControlName="petsAllowed" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
                ></div>
              </div>
            </label>
            @if (group.get('petsAllowed')?.value) {
              <div class="animate-in fade-in slide-in-from-top-2">
                <textarea
                  formControlName="petPolicyDescription"
                  rows="2"
                  placeholder="VD: Phụ phí 100k/đêm đối với chó mèo dưới 5kg..."
                  class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-700 text-sm resize-none transition-all"
                ></textarea>
              </div>
            }
          </div>

          <div class="flex flex-col gap-3 md:col-span-2">
            <label
              class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all"
              [ngClass]="
                group.get('childrenAllowed')?.value
                  ? 'border-blue-400 bg-blue-50/30'
                  : 'border-slate-200 hover:bg-slate-50'
              "
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg
                    class="w-4 h-4 text-slate-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <span class="text-sm font-bold text-slate-800 block">Phù hợp với trẻ em</span>
                  <span class="text-[11px] text-slate-500">Gia đình có trẻ nhỏ được chào đón</span>
                </div>
              </div>
              <div class="relative inline-flex items-center">
                <input type="checkbox" formControlName="childrenAllowed" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
                ></div>
              </div>
            </label>
            @if (group.get('childrenAllowed')?.value) {
              <div class="animate-in fade-in slide-in-from-top-2">
                <textarea
                  formControlName="childrenPolicyDescription"
                  rows="2"
                  placeholder="Ghi chú về trẻ em (VD: Miễn phí cho trẻ dưới 6 tuổi ngủ chung giường)..."
                  class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-700 text-sm resize-none transition-all"
                ></textarea>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-1 h-5 bg-emerald-500 rounded-full"></div>
          <h3 class="text-lg font-bold text-slate-800">Chính sách Hủy phòng & Thanh toán</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div class="flex flex-col gap-3 md:col-span-2">
            <div
              class="flex flex-col md:flex-row gap-6 p-1 rounded-2xl transition-all"
              [ngClass]="
                group.get('allowFreeCancellation')?.value
                  ? 'bg-emerald-50/50 p-4 border border-emerald-100'
                  : ''
              "
            >
              <label
                class="flex-1 flex items-center justify-between p-4 bg-white border rounded-xl cursor-pointer shadow-sm transition-all"
                [ngClass]="
                  group.get('allowFreeCancellation')?.value
                    ? 'border-emerald-400'
                    : 'border-slate-200 hover:bg-slate-50'
                "
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center"
                    [ngClass]="
                      group.get('allowFreeCancellation')?.value
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                    "
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
                  <div>
                    <span
                      class="text-sm font-bold block"
                      [ngClass]="
                        group.get('allowFreeCancellation')?.value
                          ? 'text-emerald-700'
                          : 'text-slate-800'
                      "
                      >Cho phép hủy miễn phí</span
                    >
                    <span class="text-[11px] text-slate-500">Thu hút nhiều khách hàng hơn</span>
                  </div>
                </div>
                <div class="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    formControlName="allowFreeCancellation"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"
                  ></div>
                </div>
              </label>

              @if (group.get('allowFreeCancellation')?.value) {
                <div class="flex-1 animate-in fade-in slide-in-from-left-4 space-y-3">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-semibold text-slate-600"
                      >Hủy miễn phí trước (ngày)</label
                    >
                    <input
                      type="number"
                      formControlName="freeCancellationDays"
                      class="w-full p-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-slate-700 transition-all"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <input
                      type="text"
                      formControlName="cancellationPolicyDescription"
                      placeholder="Chi tiết chính sách hủy..."
                      class="w-full p-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-slate-700 text-sm transition-all"
                    />
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <label
              class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all"
              [ngClass]="
                group.get('requiresPrepayment')?.value
                  ? 'border-amber-400 bg-amber-50/30'
                  : 'border-slate-200 hover:bg-slate-50'
              "
            >
              <div class="flex items-center gap-3">
                <span class="text-sm font-bold text-slate-800">Yêu cầu thanh toán trước</span>
              </div>
              <div class="relative inline-flex items-center">
                <input type="checkbox" formControlName="requiresPrepayment" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"
                ></div>
              </div>
            </label>
            @if (group.get('requiresPrepayment')?.value) {
              <div class="animate-in fade-in slide-in-from-top-2">
                <textarea
                  formControlName="prepaymentPolicy"
                  rows="2"
                  placeholder="VD: Cần chuyển khoản trước 50%..."
                  class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-slate-700 text-sm resize-none transition-all"
                ></textarea>
              </div>
            }
          </div>

          <div class="flex flex-col gap-3">
            <label
              class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all"
              [ngClass]="
                group.get('securityDepositRequired')?.value
                  ? 'border-amber-400 bg-amber-50/30'
                  : 'border-slate-200 hover:bg-slate-50'
              "
            >
              <div class="flex items-center gap-3">
                <span class="text-sm font-bold text-slate-800">Yêu cầu đặt cọc hư hại</span>
              </div>
              <div class="relative inline-flex items-center">
                <input
                  type="checkbox"
                  formControlName="securityDepositRequired"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"
                ></div>
              </div>
            </label>
            @if (group.get('securityDepositRequired')?.value) {
              <div class="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2">
                <input
                  type="number"
                  formControlName="securityDepositAmount"
                  placeholder="Số tiền cọc (VNĐ)"
                  class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-slate-700 transition-all"
                />
                <input
                  type="text"
                  formControlName="securityDepositDescription"
                  placeholder="Mô tả cọc..."
                  class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-slate-700 text-sm transition-all"
                />
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PolicyStepComponent implements OnInit {
  @Input() group!: FormGroup;

  timeOptions: string[] = [];

  ngOnInit() {
    this.generateTimeOptions();
  }

  generateTimeOptions() {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const minute = m.toString().padStart(2, '0');
        this.timeOptions.push(`${hour}:${minute}`);
      }
    }
  }

  get isTimeInvalid(): boolean {
    const checkIn = this.group.get('checkInTime')?.value;
    const checkOut = this.group.get('checkOutTime')?.value;
    if (checkIn && checkOut && checkOut <= checkIn) {
      return true;
    }
    return false;
  }
}
