import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'input-field',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="w-full mt-6">
      <div class="relative group w-full">
        <div
          class="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-20 pointer-events-none"
          [ngClass]="
            error ? 'text-red-500' : isFocused || value ? 'text-blue-600' : 'text-slate-400'
          "
        >
          <mat-icon class="!text-[20px] !w-5 !h-5 flex items-center justify-center">
            {{ icon }}
          </mat-icon>
        </div>

        <input
          [type]="showPasswordToggle ? (showPassword ? 'text' : 'password') : type"
          [name]="name"
          [value]="value"
          (input)="onInputChange($event)"
          (focus)="isFocused = true"
          (blur)="isFocused = false"
          placeholder=" "
          class="peer w-full pl-12 pr-10 py-3.5 bg-white border rounded-xl text-slate-700 
                 outline-none transition-all duration-300 ease-in-out shadow-sm z-10"
          [ngClass]="
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/5'
              : 'border-slate-200 hover:border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5'
          "
        />

        <label
          class="absolute left-11 top-1/2 -translate-y-1/2 px-2 transition-all duration-200 pointer-events-none
                 bg-white z-20 text-sm leading-none
                 peer-focus:top-0 peer-focus:left-5 peer-focus:text-[11px] peer-focus:font-bold
                 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-5 peer-[:not(:placeholder-shown)]:text-[11px]"
          [ngClass]="{
            'text-red-500': error,
            'text-blue-600': !error && (isFocused || value),
            'text-slate-400': !error && !isFocused && !value,
            'top-0 left-5 text-[11px]': type === 'date',
          }"
        >
          {{ placeholder }}
        </label>

        @if (showPasswordToggle) {
          <button
            type="button"
            (click)="togglePassword()"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md
                   transition-all duration-200 active:scale-90 z-20"
            [ngClass]="error ? 'text-red-500' : 'text-slate-400 hover:text-blue-600'"
          >
            <mat-icon class="!text-[20px] !w-5 !h-5 flex items-center justify-center">
              {{ showPassword ? 'visibility' : 'visibility_off' }}
            </mat-icon>
          </button>
        }
      </div>

      @if (error) {
        <div
          class="flex items-center gap-1.5 mt-1.5 ml-4 text-red-500 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <mat-icon class="!text-[14px] !w-3.5 !h-3.5 flex items-center justify-center mt-[1px]">
            error_outline
          </mat-icon>
          <span class="text-[12px] font-medium leading-tight">
            {{ error }}
          </span>
        </div>
      }
    </div>
  `,
})
export class InputField {
  @Input() icon: string = 'person';
  @Input() type: string = 'text';
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() placeholder: string = 'Nhập thông tin...';
  @Input() showPasswordToggle: boolean = false;
  @Input() error: string = '';

  @Output() valueChange = new EventEmitter<string>();

  showPassword = false;
  isFocused = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onInputChange(event: any) {
    this.value = event.target.value;
    this.valueChange.emit(this.value);
  }
}
