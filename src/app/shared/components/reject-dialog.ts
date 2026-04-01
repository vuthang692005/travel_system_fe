import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reject-dialog',
  standalone: true,
  imports: [MatIconModule, FormsModule, CommonModule],
  template: `
    <div
      class="p-8 max-w-[400px] w-full bg-white rounded-[32px] shadow-2xl border border-gray-50 animate-in zoom-in duration-300"
    >
      <div class="flex flex-col items-center text-center">
        <div class="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-red-50">
          <div class="w-14 h-14 rounded-full flex items-center justify-center bg-red-100">
            <mat-icon class="!w-8 !h-8 text-[32px] flex items-center justify-center text-red-600"
              >cancel</mat-icon
            >
          </div>
        </div>

        <h3 class="text-2xl font-black text-[#1a2b49] mb-2 tracking-tight">Từ chối hồ sơ</h3>
        <p class="text-slate-500 text-sm leading-relaxed mb-6 px-2">
          Vui lòng nhập lý do từ chối để chủ sở hữu có thể khắc phục.
        </p>

        <div class="w-full mb-8 text-left">
          <textarea
            [(ngModel)]="reason"
            rows="3"
            placeholder="Nhập lý do từ chối (bắt buộc)..."
            class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-500/10 transition-all text-sm resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-3 w-full">
          <button
            (click)="dialogRef.close(null)"
            class="w-full py-3 rounded-xl font-bold bg-gray-100 text-slate-600 hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            (click)="dialogRef.close(reason)"
            [disabled]="!reason.trim()"
            class="w-full py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  `,
})
export class RejectDialogComponent {
  readonly dialogRef = inject(MatDialogRef<RejectDialogComponent>);
  reason: string = '';
}
