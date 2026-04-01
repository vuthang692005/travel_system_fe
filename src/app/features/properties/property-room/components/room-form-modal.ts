import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal'; // Chỉnh lại đường dẫn nếu cần

@Component({
  selector: 'app-room-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  template: `
    <app-modal
      [title]="isEditMode ? 'Cập nhật phòng' : 'Thêm phòng mới'"
      [(isOpen)]="isOpen"
      (isOpenChange)="isOpenChange.emit($event)"
    >
      @if (roomForm) {
        <div class="space-y-8" [formGroup]="roomForm">
          <div class="space-y-4">
            <h4
              class="text-[#1ea4e9] font-bold flex items-center gap-2 border-b border-slate-100 pb-2"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Thông tin phòng
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5 md:col-span-2">
                <label class="text-xs font-semibold text-slate-600">Tên phòng *</label>
                <input
                  type="text"
                  formControlName="roomName"
                  placeholder="VD: Phòng Tiêu Chuẩn Giường Đôi"
                  class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#1ea4e9] focus:ring-4 focus:ring-[#1ea4e9]/10 outline-none text-sm transition-all"
                />
              </div>

              <div class="flex flex-col gap-1.5 relative">
                <label class="text-xs font-semibold text-slate-600">Hạng phòng *</label>
                <select
                  formControlName="roomCategory"
                  class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#1ea4e9] focus:ring-4 focus:ring-[#1ea4e9]/10 outline-none text-sm transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled selected>Chọn hạng phòng</option>
                  <option value="STANDARD">Phòng Tiêu Chuẩn</option>
                  <option value="DELUXE">Phòng Sang trọng</option>
                  <option value="SUITE">Phòng Cao Cấp</option>
                </select>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-600">Sức chứa (Người) *</label>
                <input
                  type="number"
                  formControlName="capacity"
                  min="1"
                  class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#1ea4e9] focus:ring-4 focus:ring-[#1ea4e9]/10 outline-none text-sm transition-all"
                />
              </div>

              <div class="flex flex-col gap-1.5 md:col-span-2">
                <label class="text-xs font-semibold text-slate-600">Diện tích (m²)</label>
                <input
                  type="number"
                  formControlName="area"
                  min="0"
                  class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#1ea4e9] focus:ring-4 focus:ring-[#1ea4e9]/10 outline-none text-sm transition-all"
                />
              </div>

              <div class="flex flex-col gap-1.5 md:col-span-2">
                <label class="text-xs font-semibold text-slate-600">Mô tả phòng</label>
                <textarea
                  rows="3"
                  formControlName="description"
                  class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#1ea4e9] focus:ring-4 focus:ring-[#1ea4e9]/10 outline-none text-sm transition-all"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h4
              class="text-[#1ea4e9] font-bold flex items-center gap-2 border-b border-slate-100 pb-2"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Thiết lập giá
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-600">Giá ngày thường (VNĐ) *</label>
                <input
                  type="number"
                  formControlName="pricePerNight"
                  min="0"
                  class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#1ea4e9] focus:ring-4 focus:ring-[#1ea4e9]/10 outline-none text-sm font-bold text-[#1ea4e9] transition-all"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-600">Giá cuối tuần (VNĐ) *</label>
                <input
                  type="number"
                  formControlName="weekendPrice"
                  min="0"
                  class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 outline-none text-sm font-bold text-rose-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div class="space-y-4" formGroupName="amenities">
            <h4
              class="text-[#1ea4e9] font-bold flex items-center gap-2 border-b border-slate-100 pb-2"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              Tiện ích trong phòng
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              @for (item of amenitiesList; track item.key) {
                <label
                  class="flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all"
                  [ngClass]="
                    roomForm.get('amenities.' + item.key)?.value
                      ? 'border-[#1ea4e9] bg-blue-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  "
                >
                  <input
                    type="checkbox"
                    [formControlName]="item.key"
                    class="w-4 h-4 text-[#1ea4e9] rounded border-slate-300 focus:ring-[#1ea4e9]"
                  />
                  <span
                    class="text-sm font-medium"
                    [ngClass]="
                      roomForm.get('amenities.' + item.key)?.value
                        ? 'text-[#0f294d]'
                        : 'text-slate-600'
                    "
                    >{{ item.label }}</span
                  >
                </label>
              }
            </div>
          </div>

          <div class="space-y-4 pt-2">
            <h4
              class="text-[#1ea4e9] font-bold flex items-center gap-2 border-b border-slate-100 pb-2"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Hình ảnh phòng
            </h4>
            <div class="grid grid-cols-3 md:grid-cols-5 gap-4">
              @for (img of existingImages; track $index) {
                <div
                  class="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                >
                  <img [src]="img" class="w-full h-full object-cover" />
                  <button
                    type="button"
                    (click)="removeExistingImage($index)"
                    class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm"
                  >
                    <svg
                      class="w-6 h-6 text-rose-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              }

              @for (img of previewImages; track $index) {
                <div
                  class="relative group aspect-square rounded-xl overflow-hidden border-2 border-[#1ea4e9] shadow-sm"
                >
                  <img [src]="img" class="w-full h-full object-cover" />
                  <span
                    class="absolute top-1 left-1 bg-[#1ea4e9] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm"
                    >MỚI</span
                  >
                  <button
                    type="button"
                    (click)="removeNewImage($index)"
                    class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm"
                  >
                    <svg
                      class="w-6 h-6 text-rose-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              }

              <label
                class="aspect-square rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-[#1ea4e9] transition-colors text-blue-400 hover:text-[#1ea4e9] group shadow-sm"
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  (change)="onFileSelected($event)"
                />
                <svg
                  class="w-8 h-8 mb-1 group-hover:-translate-y-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span class="text-[11px] font-bold uppercase tracking-wider">Thêm ảnh</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end pt-6 border-t border-slate-200 mt-8">
            <button
              type="button"
              (click)="onSubmit()"
              class="px-8 py-3 bg-[#1ea4e9] hover:bg-[#1891d4] text-white font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              <svg
                *ngIf="!isEditMode"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <svg
                *ngIf="isEditMode"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              {{ isEditMode ? 'Lưu thay đổi' : 'Tạo phòng mới' }}
            </button>
          </div>
        </div>
      }
    </app-modal>
  `,
})
export class RoomFormModalComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() propertyId!: number;
  @Input() roomData: any = null;

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<FormData>();

  roomForm!: FormGroup;
  isEditMode = false;

  // Xử lý ảnh
  existingImages: string[] = [];
  newImages: File[] = [];
  previewImages: string[] = [];

  // Tiện ích phòng
  amenitiesList = [
    { key: 'tv', label: 'Tivi' },
    { key: 'ac', label: 'Điều hòa' },
    { key: 'minibar', label: 'Minibar' },
    { key: 'tea_coffee', label: 'Trà/Cà phê' },
    { key: 'wifi', label: 'Wifi miễn phí' },
    { key: 'bathtub', label: 'Bồn tắm' },
    { key: 'balcony', label: 'Ban công' },
    { key: 'non_smoking', label: 'Không hút thuốc' },
  ];

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['roomData'] || changes['isOpen']) {
      if (this.isOpen && this.roomForm) {
        this.isEditMode = !!this.roomData;
        this.populateForm();
      }
    }
  }

  initForm() {
    this.roomForm = this.fb.group({
      roomName: ['', Validators.required],
      roomCategory: ['', Validators.required], // Đã khớp với Enum backend
      capacity: [1, [Validators.required, Validators.min(1)]],
      area: [0],
      pricePerNight: [0, [Validators.required, Validators.min(0)]],
      weekendPrice: [0, Validators.min(0)],
      description: [''],

      amenities: this.fb.group({
        tv: [false],
        ac: [false],
        minibar: [false],
        tea_coffee: [false],
        wifi: [false],
        bathtub: [false],
        balcony: [false],
        non_smoking: [false],
      }),
    });
  }

  populateForm() {
    this.roomForm.reset({
      roomCategory: '',
      capacity: 1,
      area: 0,
      pricePerNight: 0,
      weekendPrice: 0,
    });
    this.existingImages = [];
    this.newImages = [];
    this.previewImages.forEach((url) => URL.revokeObjectURL(url));
    this.previewImages = [];

    if (this.isEditMode && this.roomData) {
      this.roomForm.patchValue({
        roomName: this.roomData.roomName,
        roomCategory: this.roomData.roomCategory,
        capacity: this.roomData.capacity,
        area: this.roomData.area,
        pricePerNight: this.roomData.pricePerNight,
        weekendPrice: this.roomData.weekendPrice,
        description: this.roomData.description,
      });

      const amGroup = this.roomForm.get('amenities') as FormGroup;
      if (this.roomData.amenities && Array.isArray(this.roomData.amenities)) {
        this.roomData.amenities.forEach((item: string) => {
          if (amGroup.get(item)) amGroup.get(item)?.setValue(true);
        });
      }

      this.existingImages = this.roomData.images ? [...this.roomData.images] : [];
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        this.newImages.push(file);
        this.previewImages.push(URL.createObjectURL(file));
      }
    }
    event.target.value = '';
  }

  removeExistingImage(index: number) {
    this.existingImages.splice(index, 1);
  }

  removeNewImage(index: number) {
    this.newImages.splice(index, 1);
    URL.revokeObjectURL(this.previewImages[index]);
    this.previewImages.splice(index, 1);
  }

  onSubmit() {
    if (this.roomForm.invalid) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      // Force hiển thị lỗi đỏ (nếu bạn có style error state)
      Object.keys(this.roomForm.controls).forEach((key) => {
        this.roomForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValues = this.roomForm.value;

    const roomRequestDTO = {
      propertyId: this.propertyId,
      roomName: formValues.roomName,
      roomCategory: formValues.roomCategory,
      pricePerNight: formValues.pricePerNight,
      weekendPrice: formValues.weekendPrice,
      capacity: formValues.capacity,
      description: formValues.description,
      area: formValues.area,
      amenities: Object.keys(formValues.amenities).filter(
        (key) => formValues.amenities[key] === true,
      ),
    };

    const formData = new FormData();
    formData.append(
      'roomData',
      new Blob([JSON.stringify(roomRequestDTO)], { type: 'application/json' }),
    );

    this.newImages.forEach((file) => {
      formData.append('images', file);
    });

    this.save.emit(formData);
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}
