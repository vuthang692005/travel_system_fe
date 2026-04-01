import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PropertyType } from '../../../../core/models/property.model'; // Đảm bảo đường dẫn đúng

@Component({
  selector: 'app-property-type-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
      <div>
        <h2 class="text-2xl font-black text-slate-800 text-center">
          Bạn muốn đăng ký loại hình nào?
        </h2>
        <p class="text-slate-500 text-sm mt-1 text-center">
          Chọn một loại hình phù hợp nhất với cơ sở lưu trú của bạn.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (type of propertyTypes; track type.value) {
          <div
            (click)="selectType(type.value)"
            class="p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md flex items-start gap-4"
            [ngClass]="
              control.value === type.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 hover:border-blue-300'
            "
          >
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center"
              [ngClass]="
                control.value === type.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              "
            >
              <mat-icon>{{ type.icon }}</mat-icon>
            </div>
            <div>
              <h3 class="font-bold text-slate-800 text-lg">{{ type.label }}</h3>
              <p class="text-slate-500 text-sm mt-1">{{ type.desc }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class PropertyTypeStepComponent {
  @Input() control!: FormControl;

  propertyTypes = [
    {
      value: PropertyType.HOTEL,
      label: 'Khách sạn',
      icon: 'domain',
      desc: 'Cơ sở lưu trú có nhiều phòng, dịch vụ lễ tân 24/7.',
    },
    {
      value: PropertyType.RESORT,
      label: 'Khu nghỉ dưỡng (Resort)',
      icon: 'holiday_village',
      desc: 'Khu phức hợp rộng lớn với nhiều tiện ích nghỉ dưỡng.',
    },
    {
      value: PropertyType.HOMESTAY,
      label: 'Homestay',
      icon: 'cottage',
      desc: 'Trải nghiệm văn hóa địa phương trong không gian ấm cúng.',
    },
    {
      value: PropertyType.VILLA,
      label: 'Biệt thự (Villa)',
      icon: 'villa',
      desc: 'Không gian riêng tư, sang trọng cho nhóm hoặc gia đình.',
    },
  ];

  selectType(value: PropertyType) {
    this.control.setValue(value);
  }
}
