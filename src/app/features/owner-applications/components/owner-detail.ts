import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OwnerApplication } from '../../../core/models/owner-application.model';

@Component({
  selector: 'app-owner-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <div
        class="bg-white w-full max-w-5xl max-h-[90vh] rounded-[0.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
      >
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img
                [src]="application.applicantAvatar || '/avatarDefault.jpg'"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-800">{{ application.applicantFullName }}</h2>
              <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">
                ID Hồ sơ: #{{ application.id }}
              </p>
            </div>
          </div>
          <button
            (click)="onClose.emit()"
            class="text-slate-400 hover:text-slate-800 transition-colors"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-8 space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section class="space-y-4">
              <h3
                class="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"
              >
                <mat-icon class="scale-75">person</mat-icon> Thông tin cá nhân
              </h3>
              <div class="bg-slate-50 rounded-2xl p-5 space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Email:</span>
                  <span class="font-bold text-slate-700">{{ application.applicantEmail }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Số điện thoại:</span>
                  <span class="font-bold text-slate-700">{{
                    application.applicantPhoneNumber
                  }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Ngày sinh:</span>
                  <span class="font-bold text-slate-700">{{ application.applicantDob }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Số CCCD:</span>
                  <span class="font-bold text-slate-700">{{ application.personalIdCard }}</span>
                </div>
              </div>
            </section>

            <section class="space-y-4">
              <h3
                class="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"
              >
                <mat-icon class="scale-75">business</mat-icon> Thông tin kinh doanh
              </h3>
              <div class="bg-slate-50 rounded-2xl p-5 space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Mã số GPKD:</span>
                  <span class="font-bold text-slate-700">{{
                    application.businessLicenseNumber
                  }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Địa chỉ thường trú:</span>
                  <span class="font-bold text-slate-700 text-right">{{
                    application.permanentAddress
                  }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Quê quán:</span>
                  <span class="font-bold text-slate-700 text-right">{{
                    application.hometownAddress
                  }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Ngày nộp đơn:</span>
                  <span class="font-bold text-blue-600">{{ application.createdAt }}</span>
                </div>
              </div>
            </section>
          </div>

          <section class="space-y-4">
            <h3
              class="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"
            >
              <mat-icon class="scale-75">description</mat-icon> Ảnh minh chứng
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              @for (img of images; track img.label) {
                <div class="group relative">
                  <p class="text-[10px] font-black text-slate-400 mb-2 uppercase text-center">
                    {{ img.label }}
                  </p>
                  <div
                    (click)="selectedPreview.set(img.url)"
                    class="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group-hover:shadow-md group-hover:border-blue-400 transition-all cursor-zoom-in relative"
                  >
                    <img [src]="img.url" class="w-full h-full object-cover" />
                    <div
                      class="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors flex items-center justify-center"
                    >
                      <mat-icon
                        class="text-white opacity-0 group-hover:opacity-100 scale-150 transition-all"
                        >zoom_in</mat-icon
                      >
                    </div>
                  </div>
                </div>
              }
            </div>
          </section>
        </div>

        @if (application.status === 'PENDING') {
          <div
            class="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3"
          >
            <button
              (click)="onReject.emit(application)"
              class="px-8 py-3 rounded-2xl text-sm font-black text-red-600 border-2 border-red-100 hover:bg-red-50 transition-all active:scale-95 flex items-center gap-2"
            >
              <mat-icon>cancel</mat-icon> Từ chối
            </button>
            <button
              (click)="onApprove.emit(application)"
              class="px-8 py-3 rounded-2xl text-sm font-black text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center gap-2"
            >
              <mat-icon>check_circle</mat-icon> Phê duyệt hồ sơ
            </button>
          </div>
        }
      </div>
    </div>

    @if (selectedPreview()) {
      <div
        (click)="selectedPreview.set(null)"
        class="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300"
      >
        <button
          class="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
          (click)="selectedPreview.set(null)"
        >
          <mat-icon class="scale-150">close</mat-icon>
        </button>

        <div
          class="relative max-w-7xl max-h-[85vh] flex items-center justify-center"
          (click)="$event.stopPropagation()"
        >
          <img
            [src]="selectedPreview()"
            class="w-full h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
          />
          <div class="absolute -bottom-10 left-0 right-0 text-center">
            <p class="text-white/60 text-xs font-bold uppercase tracking-widest">
              Bấm ra ngoài để đóng
            </p>
          </div>
        </div>
      </div>
    }
  `,
})
export class OwnerApplicationDetail {
  @Input({ required: true }) application!: OwnerApplication;
  @Output() onClose = new EventEmitter<void>();
  @Output() onApprove = new EventEmitter<OwnerApplication>();
  @Output() onReject = new EventEmitter<OwnerApplication>();

  // Signal quản lý ảnh đang xem
  selectedPreview = signal<string | null>(null);

  // Getter tổ chức dữ liệu ảnh
  get images() {
    return [
      { label: 'Mặt trước CCCD', url: this.application.cardFrontImage },
      { label: 'Mặt sau CCCD', url: this.application.cardBackImage },
      { label: 'Giấy phép kinh doanh', url: this.application.businessLicenseImage },
    ];
  }
}
