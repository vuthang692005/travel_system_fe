import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-unit-setup-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div
      class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
      [formGroup]="group"
    >
      <div class="bg-blue-50/50 border-l-2 border-blue-500 p-4 rounded-r-xl mb-6">
        <div class="flex gap-3">
          <mat-icon class="text-blue-500 text-sm mt-0.5 scale-90">info</mat-icon>
          <div>
            <h4 class="text-sm font-bold text-slate-800">
              Thiết lập Nguyên căn (Villa / Homestay)
            </h4>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed">
              Hãy thiết lập thông tin chi tiết (Giá, Sức chứa, Tiện nghi) cho toàn bộ căn nhà tại
              đây.
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-6 md:p-8">
        <div class="space-y-6">
          <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
            <mat-icon class="text-blue-500 scale-90">bed</mat-icon>
            <h3 class="text-base font-bold text-slate-800">Thông tin chi tiết</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 pt-2">
            <div class="relative md:col-span-2">
              <input
                type="text"
                formControlName="unitName"
                class="peer w-full p-4 bg-transparent border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-700 transition-all"
                placeholder=" "
              />
              <label
                class="absolute left-3 -top-2 bg-white px-1.5 text-[11px] font-semibold text-slate-500 transition-colors peer-focus:text-blue-500"
                >Tên hiển thị (VD: Nguyên căn Villa 3PN)</label
              >
            </div>

            <div class="relative">
              <input
                type="number"
                formControlName="price"
                class="peer w-full p-4 bg-transparent border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-700 transition-all"
                placeholder=" "
              />
              <label
                class="absolute left-3 -top-2 bg-white px-1.5 text-[11px] font-semibold text-slate-500 transition-colors peer-focus:text-blue-500"
                >Giá thuê ngày thường / đêm (VNĐ)</label
              >
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium"
                >₫</span
              >
            </div>

            <div class="relative">
              <input
                type="number"
                formControlName="weekendPrice"
                class="peer w-full p-4 bg-transparent border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-700 transition-all"
                placeholder=" "
              />
              <label
                class="absolute left-3 -top-2 bg-white px-1.5 text-[11px] font-semibold text-slate-500 transition-colors peer-focus:text-blue-500"
                >Giá thuê cuối tuần / đêm (VNĐ)</label
              >
              <mat-icon class="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 scale-75"
                >trending_up</mat-icon
              >
            </div>

            <div class="relative md:col-span-2">
              <input
                type="number"
                formControlName="capacity"
                class="peer w-full p-4 bg-transparent border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-700 transition-all"
                placeholder=" "
              />
              <label
                class="absolute left-3 -top-2 bg-white px-1.5 text-[11px] font-semibold text-slate-500 transition-colors peer-focus:text-blue-500"
                >Sức chứa tiêu chuẩn (Người)</label
              >
              <mat-icon class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 scale-75"
                >people_outline</mat-icon
              >
            </div>
          </div>
        </div>

        <div class="space-y-6 mt-10" formGroupName="amenities">
          <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
            <mat-icon class="text-blue-500 scale-90">diamond</mat-icon>
            <h3 class="text-base font-bold text-slate-800">Tiện nghi có sẵn</h3>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
            @for (item of amenitiesList; track item.key) {
              <label
                class="flex items-center gap-3 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50"
              >
                <input
                  type="checkbox"
                  [formControlName]="item.key"
                  class="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <mat-icon class="text-slate-500">{{ item.icon }}</mat-icon>
                <span class="font-medium text-slate-700">{{ item.label }}</span>
              </label>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UnitSetupStepComponent {
  @Input() group!: FormGroup;

  amenitiesList = [
    { key: 'tv', label: 'TV', icon: 'tv' },
    { key: 'ac', label: 'Điều hòa', icon: 'ac_unit' },
    { key: 'minibar', label: 'Minibar', icon: 'kitchen' },
    { key: 'tea_coffee', label: 'Trà/Cà phê', icon: 'local_cafe' },
    { key: 'wifi', label: 'Wifi', icon: 'wifi' },
    { key: 'bathtub', label: 'Bồn tắm', icon: 'bathtub' },
    { key: 'balcony', label: 'Ban công', icon: 'balcony' },
    { key: 'non_smoking', label: 'Không hút thuốc', icon: 'smoke_free' },
  ];
}
