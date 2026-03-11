import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OwnerApplication } from '../../../core/models/owner-application.model';

@Component({
  selector: 'app-owner-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div
      class="bg-white rounded-[0.5rem] border border-slate-100 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
      <div class="flex items-end gap-3.5 mb-5">
        <div
          class="w-12 h-12 rounded-full overflow-hidden shadow-sm flex-shrink-0 border border-slate-50"
        >
          <img
            [src]="data.applicantAvatar || '/avatarDefault.jpg'"
            class="w-full h-full object-cover"
            onerror="this.src='avatarDefault.png'"
          />
        </div>

        <div class="flex-1 flex flex-col">
          <div class="flex justify-end mb-1">
            <span
              [ngClass]="statusClasses[data.status]"
              class="px-2 py-0.3 rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm"
            >
              <mat-icon class="!text-[10px] !w-2.5 !h-2.5">{{ icon }}</mat-icon>
              {{ status }}
            </span>
          </div>

          <h3 class="text-sm font-black text-slate-800 leading-tight mb-0.5">
            {{ data.applicantFullName }}
          </h3>

          <p
            class="text-[9px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-tighter"
          >
            <mat-icon class="!text-[12px] !w-3 !h-3 text-slate-300">business</mat-icon>
            GPKD: {{ data.businessLicenseNumber }}
          </p>
        </div>
      </div>

      <div class="space-y-2.5 mb-6">
        <div class="flex items-center gap-2.5 text-[13px] text-slate-600 font-medium">
          <mat-icon class="text-slate-300 !w-4 !h-4 !text-[16px] flex items-center justify-center"
            >location_on</mat-icon
          >
          {{ data.permanentAddress }}
        </div>
        <div class="flex items-center gap-2.5 text-[13px] text-slate-600 font-medium">
          <mat-icon class="text-slate-300 !w-4 !h-4 !text-[16px] flex items-center justify-center"
            >mail</mat-icon
          >
          {{ data.applicantEmail }}
        </div>

        <div class="flex items-center justify-between pt-2.5 border-t border-slate-50">
          <span class="text-[10px] text-slate-400 font-bold uppercase">Ngày nộp:</span>
          <span class="text-xs font-black text-[#1a2b49]">{{ data.createdAt }}</span>
        </div>
      </div>

      <button
        (click)="onView.emit(data)"
        class="w-full py-2.5 bg-blue-50 text-blue-600 text-xs font-black rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
      >
        <mat-icon class="!text-[16px] !w-4 !h-4 flex items-center justify-center"
          >visibility</mat-icon
        >
        Xem hồ sơ
      </button>
    </div>
  `,
})
export class OwnerCard {
  @Input() data!: OwnerApplication;
  @Output() onView = new EventEmitter<OwnerApplication>();

  status = 'Không xác định';
  icon = 'help_outline';

  statusClasses: any = {
    PENDING: 'bg-amber-50 text-amber-600 border border-amber-100',
    APPROVED: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    REJECTED: 'bg-red-50 text-red-600 border border-red-100',
  };

  statusConfigs = [
    { value: 'PENDING', label: 'Chờ duyệt', icon: 'schedule' },
    { value: 'APPROVED', label: 'Đã duyệt', icon: 'check_circle' },
    { value: 'REJECTED', label: 'Từ chối', icon: 'cancel' },
  ];

  ngOnInit() {
    const match = this.statusConfigs.find((item) => item.value === this.data.status);
    if (match) {
      this.status = match.label;
      this.icon = match.icon;
    }
  }
}
