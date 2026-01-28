import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <button
      type="button"
      (click)="!isLoading && handleButtonClick()"
      [disabled]="isLoading"
      [class]="
        'flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl transition-all font-medium ' +
        (isLoading ? 'opacity-70 cursor-not-allowed ' : 'active:scale-95 ') +
        bgColor
      "
    >
      @if (isLoading) {
        <mat-icon class="animate-spin scale-90">sync</mat-icon>
      } @else {
        <mat-icon class="scale-90">{{ icon }}</mat-icon>
      }

      <span>{{ isLoading ? 'Đang xử lý...' : label }}</span>
    </button>
  `,
})
export class AppButton {
  @Input() icon: string = 'search';
  @Input() label: string = 'Tìm kiếm';
  @Input() bgColor: string = 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700';

  // Thêm Input này để sửa lỗi NG8002
  @Input() isLoading: boolean = false;

  @Output() onClick = new EventEmitter<void>();

  handleButtonClick() {
    this.onClick.emit();
  }
}
