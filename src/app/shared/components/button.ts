import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button', // Đổi tên selector cho rõ nghĩa
  standalone: true,
  imports: [MatIconModule],
  template: `
    <button
      (click)="handleButtonClick()"
      [class]="
        'flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl transition-all active:scale-95 font-medium ' +
        bgColor
      "
    >
      <mat-icon class="scale-90">{{ icon }}</mat-icon>
      <span>{{ label }}</span>
    </button>
  `,
})
export class AppButton {
  @Input() icon: string = 'search';
  @Input() label: string = 'Tìm kiếm';
  @Input() bgColor: string = 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700';
  @Output() onClick = new EventEmitter<void>();
  handleButtonClick() {
    this.onClick.emit();
  }
}
