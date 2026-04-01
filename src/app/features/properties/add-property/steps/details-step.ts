import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
      [formGroup]="group"
    >
      <div>
        <h2 class="text-2xl font-black text-slate-800">Chi tiết cơ sở</h2>
        <p class="text-slate-500 text-sm mt-1">
          Cung cấp tên và mô tả hấp dẫn để khách hàng hiểu rõ hơn về bạn.
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="font-semibold text-slate-700 text-sm">Tên chỗ nghỉ *</label>
          <input
            formControlName="propertyName"
            placeholder="Tên khách sạn / homestay của bạn"
            class="p-3 bg-white rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-slate-700 text-sm">Diện tích (m²)</label>
          <input
            type="number"
            formControlName="area"
            class="p-3 bg-white rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-slate-700 text-sm">Mô tả tổng quan</label>
          <textarea
            formControlName="description"
            rows="4"
            placeholder="Mô tả điểm nổi bật, không gian..."
            class="p-3 bg-white rounded-xl border border-slate-200 focus:border-blue-500 outline-none resize-none"
          ></textarea>
        </div>
      </div>
    </div>
  `,
})
export class DetailsStepComponent {
  @Input() group!: FormGroup;
}
