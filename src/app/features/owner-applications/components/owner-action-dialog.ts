import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms'; // Sửa lại import đúng ở đây
import { OwnerApplication } from '../../../core/models/owner-application.model';
import { AppButton } from '../../../shared/components/button';

@Component({
  selector: 'app-owner-action-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  template: `
    <div
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        class="bg-white w-full max-w-md rounded-[1.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div class="p-8 pb-0 text-center relative">
          <button
            (click)="onCancel.emit()"
            [disabled]="isLoading"
            class="absolute right-6 top-6 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <mat-icon>close</mat-icon>
          </button>

          <div
            [ngClass]="isApprove ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'"
            class="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <mat-icon class="scale-[1.3]">{{
              isApprove ? 'person_add' : 'person_remove'
            }}</mat-icon>
          </div>

          <h2 class="text-lg font-black text-slate-800 mb-1">
            {{ isApprove ? 'Phê duyệt đơn đăng ký Chủ sở hữu' : 'Từ chối đơn đăng ký Chủ sở hữu' }}
          </h2>
          <p class="text-[11px] text-slate-500 font-medium px-4">
            {{
              isApprove
                ? 'Xác nhận thông tin trước khi tiến hành phê duyệt.'
                : 'Vui lòng cung cấp lý do từ chối đơn đăng ký.'
            }}
          </p>
        </div>

        <div class="p-8 pt-6 space-y-5">
          <div
            [ngClass]="
              isApprove ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'
            "
            class="p-4 rounded-xl border"
          >
            <p
              [ngClass]="isApprove ? 'text-emerald-700' : 'text-red-700'"
              class="text-[9px] font-black uppercase tracking-wider mb-2"
            >
              Bạn đang {{ isApprove ? 'phê duyệt' : 'từ chối' }} đơn của:
            </p>
            <h4 class="text-sm font-black text-slate-800">{{ application.applicantFullName }}</h4>
            <p class="text-[11px] text-slate-500 font-medium">{{ application.applicantEmail }}</p>

            @if (isApprove) {
              <p
                class="text-[10px] text-emerald-700 font-bold mt-3 border-t border-emerald-100 pt-2"
              >
                Tài khoản này sẽ được cấp quyền <span class="underline">CHỦ SỞ HỮU (OWNER)</span>.
              </p>
            }
          </div>

          @if (!isApprove) {
            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1"
                >Lý do từ chối <span class="text-red-500">*</span></label
              >
              <textarea
                [(ngModel)]="rejectionReason"
                [disabled]="isLoading"
                placeholder="Nhập lý do..."
                class="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all text-xs resize-none font-medium"
              ></textarea>
            </div>
          }
        </div>

        <div class="px-8 pb-8 flex items-center justify-end gap-2">
          <button
            (click)="onCancel.emit()"
            [disabled]="isLoading"
            class="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            Hủy
          </button>

          <button
            (click)="!isLoading && submit()"
            [disabled]="isLoading"
            [ngClass]="
              isApprove
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                : 'bg-red-600 hover:bg-red-700 shadow-red-200'
            "
            class="px-6 py-2.5 rounded-xl text-[11px] font-black text-white shadow-lg transition-all active:scale-95"
          >
            @if (isLoading) {
              <mat-icon class="animate-spin !text-[14px] !w-3.5 !h-3.5">sync</mat-icon>
              <span>Đang xử lý...</span>
            } @else {
              {{ isApprove ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối' }}
            }
          </button>
        </div>
      </div>
    </div>
  `,
})
export class OwnerActionDialog {
  @Input({ required: true }) application!: OwnerApplication;
  @Input({ required: true }) mode!: 'APPROVE' | 'REJECT';
  @Input() isLoading: boolean = false;

  @Output() onCancel = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<{ id: number; status: string; reason?: string }>();

  rejectionReason = '';
  get isApprove() {
    return this.mode === 'APPROVE';
  }

  submit() {
    this.onConfirm.emit({
      id: this.application.id,
      status: this.isApprove ? 'APPROVED' : 'REJECTED',
      reason: this.isApprove ? undefined : this.rejectionReason,
    });
  }
}
