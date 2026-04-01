import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-amenities-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div
      class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
      [formGroup]="group"
    >
      <div>
        <h2 class="text-2xl font-black text-slate-800">Tiện nghi có sẵn</h2>
        <p class="text-slate-500 text-sm mt-1">Chọn các tiện nghi mà cơ sở của bạn cung cấp.</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
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
  `,
})
export class AmenitiesStepComponent {
  @Input() group!: FormGroup;

  amenitiesList = [
    { key: 'pool', label: 'Hồ bơi', icon: 'pool' },
    { key: 'parking', label: 'Bãi đỗ xe', icon: 'local_parking' },
    { key: 'sauna', label: 'Phòng xông hơi', icon: 'hot_tub' },
    { key: 'spa', label: 'Spa & Massage', icon: 'spa' },
    { key: 'non_smoking', label: 'Không hút thuốc', icon: 'smoke_free' },
    { key: 'wifi', label: 'Wi-Fi miễn phí', icon: 'wifi' },
    { key: 'airport_transfer', label: 'Đưa đón sân bay', icon: 'airport_shuttle' },
    { key: 'pets', label: 'Cho phép thú cưng', icon: 'pets' },
    { key: 'gym', label: 'Phòng Gym', icon: 'fitness_center' },
    { key: 'smoking_area', label: 'Khu vực hút thuốc', icon: 'smoking_rooms' },
    { key: 'reception_24h', label: 'Lễ tân 24/7', icon: 'room_service' },
    { key: 'ac', label: 'Điều hòa', icon: 'ac_unit' },
  ];
}
