import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type FilterStatus = '' | 'PENDING' | 'APPROVED' | 'REJECTED';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  template: `
    <div class="flex flex-col gap-6 mb-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm"
          >
            <mat-icon class="scale-110">{{ icon }}</mat-icon>
          </div>
          <div>
            <h1 class="text-sm font-black text-[#1a2b49]">{{ headerTitle }}</h1>
            <p class="text-xs text-slate-500 font-medium">{{ subtitle }}</p>
          </div>
        </div>
        <button
          (click)="onRefresh.emit()"
          class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
        >
          <mat-icon class="scale-90">sync</mat-icon> Làm mới
        </button>
      </div>

      <div class="bg-white p-4 rounded-[1rem] border border-slate-100 shadow-sm space-y-4">
        <div class="flex items-center gap-1 p-1 bg-slate-50 rounded-2xl w-fit">
          @for (tab of tabs; track tab.value) {
            <button
              (click)="changeTab(tab.value)"
              [class]="
                selectedTab() === tab.value
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              "
              class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <mat-icon class="scale-70">{{ tab.icon }}</mat-icon>
              {{ tab.label }}
            </button>
          }
        </div>

        <div class="relative group">
          <mat-icon
            class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            >search</mat-icon
          >
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearchChange()"
            [placeholder]="searchPlaceholder"
            class="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
          />
        </div>
      </div>
    </div>
  `,
})
export class PageHeader {
  @Input() icon: string = 'dashboard';
  @Input() headerTitle: string = 'Tiêu đề';
  @Input() subtitle: string = 'Mô tả chi tiết';
  @Input() searchPlaceholder: string = 'Tìm kiếm...';

  @Output() onRefresh = new EventEmitter<void>();
  @Output() onSearch = new EventEmitter<string>();
  @Output() onFilter = new EventEmitter<FilterStatus>();

  searchQuery = '';
  selectedTab = signal<FilterStatus>('');

  tabs = [
    { label: 'Tất cả', value: '', icon: 'layers' },
    { label: 'Chờ duyệt', value: 'PENDING', icon: 'schedule' },
    { label: 'Đã duyệt', value: 'APPROVED', icon: 'check_circle' },
    { label: 'Từ chối', value: 'REJECTED', icon: 'cancel' },
  ];

  changeTab(status: any) {
    this.selectedTab.set(status);
    this.onFilter.emit(status);
  }

  onSearchChange() {
    this.onSearch.emit(this.searchQuery);
  }
}
