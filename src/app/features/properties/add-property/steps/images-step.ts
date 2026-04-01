import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-images-step',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 class="text-2xl font-black text-slate-800">Hình ảnh cơ sở</h2>
        <p class="text-slate-500 text-sm">
          Tải lên ít nhất 3 hình ảnh sắc nét để thu hút khách hàng (JPG, PNG, WEBP).
        </p>
      </div>

      <label
        class="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-300 rounded-3xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
      >
        <mat-icon class="scale-[2] text-slate-300 group-hover:text-blue-500 mb-4 transition-colors"
          >cloud_upload</mat-icon
        >
        <span class="font-bold text-slate-600 group-hover:text-blue-600"
          >Kéo thả ảnh vào đây hoặc Nhấn để tải lên</span
        >
        <input
          type="file"
          class="hidden"
          multiple
          accept="image/jpeg, image/png, image/webp"
          (change)="onFileSelect($event)"
        />
      </label>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        @for (url of previews(); track url; let i = $index) {
          <div
            class="relative aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm group"
          >
            <img [src]="url" class="w-full h-full object-cover" />
            <button
              type="button"
              (click)="removeImage(i)"
              class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
            >
              <mat-icon class="scale-75">delete</mat-icon>
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class ImagesStepComponent {
  @Input() images!: any; // Signal từ parent
  @Output() imagesChange = new EventEmitter<File[]>();

  previews = signal<string[]>([]);
  private files: File[] = [];

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files);
      this.files = [...this.files, ...newFiles];

      // Tạo Preview URL
      newFiles.forEach((file) => {
        this.previews.update((prev) => [...prev, URL.createObjectURL(file)]);
      });

      this.imagesChange.emit(this.files);
    }
  }

  removeImage(index: number) {
    this.files.splice(index, 1);
    this.previews.update((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });
    this.imagesChange.emit(this.files);
  }
}
