import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AppButton } from '../../shared/components/button';
import { ConfirmDialogData } from '../../core/models/confirm-dialog.model';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatIconModule, AppButton],
  template: `
    <div
      class="p-8 max-w-[360px] bg-white rounded-[32px] shadow-2xl border border-gray-50 animate-in zoom-in duration-300"
    >
      <div class="flex flex-col items-center text-center">
        <div
          [class]="
            'w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ' +
            (data.confirmColor?.includes('red') ? 'bg-red-50' : 'bg-blue-50')
          "
        >
          <div
            [class]="
              'w-14 h-14 rounded-full flex items-center justify-center ' +
              (data.confirmColor?.includes('red') ? 'bg-red-100' : 'bg-blue-100')
            "
          >
            <mat-icon
              [class]="
                '!w-8 !h-8 text-[32px] flex items-center justify-center ' +
                (data.confirmColor?.includes('red') ? 'text-red-600' : 'text-blue-600')
              "
            >
              {{ data.icon || 'help_outline' }}
            </mat-icon>
          </div>
        </div>

        <h3 class="text-2xl font-black text-[#1a2b49] mb-3 tracking-tight">
          {{ data.title }}
        </h3>
        <p class="text-slate-500 text-sm leading-relaxed mb-10 px-2">
          {{ data.message }}
        </p>

        <div class="grid grid-cols-2 gap-3 ">
          <app-button
            [label]="data.cancelText || 'Hủy'"
            [icon]="'close'"
            bgColor="bg-gray-100 text-slate-600 hover:bg-gray-200"
            (onClick)="dialogRef.close(false)"
            class="w-full"
          />
          <app-button
            [label]="data.confirmText || 'Xác nhận'"
            [icon]="'check'"
            [bgColor]="
              data.confirmColor ||
              'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
            "
            (onClick)="dialogRef.close(true)"
            class="w-full"
          />
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        overflow: hidden;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data: ConfirmDialogData = inject(MAT_DIALOG_DATA);
}
