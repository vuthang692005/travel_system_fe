import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'input-field',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="relative w-full group mt-6">
      <div
        class="absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 z-10"
        [class.text-blue-600]="isFocused || value"
        [class.text-slate-400]="!isFocused && !value"
        [class.group-hover:text-slate-500]="!isFocused && !value"
      >
        <mat-icon class="text-[20px] flex items-center justify-center">{{ icon }}</mat-icon>
      </div>

      <input
        [type]="showPasswordToggle ? (showPassword ? 'text' : 'password') : type"
        [name]="name"
        [value]="value"
        (input)="onInputChange($event)"
        (focus)="isFocused = true"
        (blur)="isFocused = false"
        placeholder=" "
        class="peer w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-lg text-slate-700 
               outline-none transition-all duration-300 ease-in-out
               hover:border-blue-400
               focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5
               shadow-sm
               /* Tùy chỉnh riêng cho type date */
               [&::-webkit-calendar-picker-indicator]:cursor-pointer
               [&::-webkit-calendar-picker-indicator]:absolute
               [&::-webkit-calendar-picker-indicator]:right-4
               [&::-webkit-calendar-picker-indicator]:opacity-70
               hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
      />

      <label
        class="absolute left-11 top-1/2 -translate-y-1/2 text-slate-400 px-1 transition-all duration-200 pointer-events-none
               bg-white z-20 
               peer-focus:-top-0 peer-focus:left-5 peer-focus:text-[10px] peer-focus:text-blue-600 peer-focus:font-medium
               /* Xử lý label luôn nổi lên khi có giá trị hoặc là type date */
               peer-[:not(:placeholder-shown)]:-top-0 peer-[:not(:placeholder-shown)]:left-5 peer-[:not(:placeholder-shown)]:text-[10px] 
               peer-[:not(:placeholder-shown)]:text-blue-600"
        [class.-top-0]="type === 'date'"
        [class.left-5]="type === 'date'"
        [class.text-[10px]]="type === 'date'"
      >
        {{ placeholder }}
      </label>

      @if (showPasswordToggle) {
        <button
          type="button"
          (click)="togglePassword()"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md
                 text-slate-400 hover:text-blue-600 hover:bg-blue-50 
                 transition-all duration-200 active:scale-90 z-10"
        >
          <mat-icon class="text-[20px] flex items-center justify-center">
            {{ showPassword ? 'visibility' : 'visibility_off' }}
          </mat-icon>
        </button>
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
