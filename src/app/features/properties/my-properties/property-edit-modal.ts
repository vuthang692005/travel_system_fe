import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal'; // Điều chỉnh đường dẫn đến modal của bạn

@Component({
  selector: 'app-property-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  template: `
    <app-modal
      [title]="'Chỉnh sửa: ' + (propertyDetail?.propertyName || '')"
      [(isOpen)]="isOpen"
      (isOpenChange)="isOpenChange.emit($event)"
    >
      @if (editForm) {
        <div class="space-y-8" [formGroup]="editForm">
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
              Thông tin cơ bản
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="relative pt-2 md:col-span-2">
                <label
                  class="absolute left-3 -top-0.5 bg-white px-1 text-[11px] font-semibold text-[#1ea4e9]"
                  >Tên cơ sở lưu trú</label
                >
                <input
                  type="text"
                  formControlName="propertyName"
                  class="w-full p-4 border border-slate-200 rounded-xl focus:border-[#1ea4e9] outline-none text-sm text-slate-700"
                />
              </div>

              <div class="relative pt-2">
                <label
                  class="absolute left-3 -top-0.5 bg-white px-1 text-[11px] font-semibold text-[#1ea4e9]"
                  >Diện tích (m²)</label
                >
                <input
                  type="number"
                  formControlName="area"
                  class="w-full p-4 border border-slate-200 rounded-xl focus:border-[#1ea4e9] outline-none text-sm text-slate-700"
                />
              </div>

              <div class="relative pt-2 md:col-span-2">
                <label
                  class="absolute left-3 -top-0.5 bg-white px-1 text-[11px] font-semibold text-[#1ea4e9]"
                  >Mô tả</label
                >
                <textarea
                  rows="4"
                  formControlName="description"
                  class="w-full p-4 border border-slate-200 rounded-xl focus:border-[#1ea4e9] outline-none text-sm text-slate-700"
                ></textarea>
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
              Tiện nghi chung
            </h4>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              @for (item of editAmenitiesList; track item.key) {
                <label
                  class="flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all"
                  [ngClass]="
                    editForm.get('amenities.' + item.key)?.value
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
                      editForm.get('amenities.' + item.key)?.value
                        ? 'text-[#0f294d]'
                        : 'text-slate-600'
                    "
                    >{{ item.label }}</span
                  >
                </label>
              }
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Quy định & Chính sách
            </h4>

            <div class="space-y-6">
              <div class="p-6 rounded-2xl border border-slate-200 space-y-6">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-1 h-5 bg-blue-500 rounded-full"></div>
                  <h3 class="text-lg font-bold text-slate-800">Thời gian lưu trú</h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="flex flex-col gap-2 relative">
                    <label class="text-sm font-semibold text-slate-700"
                      >Giờ nhận phòng (Check-in) *</label
                    >
                    <select
                      formControlName="checkInTime"
                      class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled selected>Chọn giờ</option>
                      @for (time of timeOptions; track time) {
                        <option [value]="time">{{ time }}</option>
                      }
                    </select>
                  </div>

                  <div class="flex flex-col gap-2 relative">
                    <label class="text-sm font-semibold text-slate-700"
                      >Giờ trả phòng (Check-out) *</label
                    >
                    <select
                      formControlName="checkOutTime"
                      class="w-full p-3.5 bg-slate-50 border rounded-xl focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                      [ngClass]="
                        isTimeInvalid
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                      "
                    >
                      <option value="" disabled selected>Chọn giờ</option>
                      @for (time of timeOptions; track time) {
                        <option [value]="time">{{ time }}</option>
                      }
                    </select>
                    @if (isTimeInvalid) {
                      <span class="text-[11px] text-red-500 font-medium absolute -bottom-5 left-0"
                        >Giờ trả phòng nên sau nhận phòng.</span
                      >
                    }
                  </div>

                  <div class="flex flex-col gap-2 md:col-span-2">
                    <label class="text-sm font-semibold text-slate-700">Khung giờ yên tĩnh</label>
                    <input
                      type="text"
                      formControlName="quietHours"
                      placeholder="VD: 22:00 - 07:00"
                      class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div class="flex flex-col gap-2 md:col-span-2">
                    <label class="text-sm font-semibold text-slate-700"
                      >Độ tuổi tối thiểu nhận phòng</label
                    >
                    <input
                      type="number"
                      formControlName="minimumAge"
                      class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div class="p-6 rounded-2xl border border-slate-200 space-y-6">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-1 h-5 bg-slate-400 rounded-full"></div>
                  <h3 class="text-lg font-bold text-slate-800">Quy định cư trú</h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-3">
                    <label
                      class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all"
                      [ngClass]="
                        editForm.get('smokingAllowed')?.value
                          ? 'border-blue-400 bg-blue-50/30'
                          : 'border-slate-200 hover:bg-slate-50'
                      "
                    >
                      <span class="text-sm font-bold text-slate-800">Cho phép hút thuốc</span>
                      <div class="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          formControlName="smokingAllowed"
                          class="sr-only peer"
                        />
                        <div
                          class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
                        ></div>
                      </div>
                    </label>
                    @if (editForm.get('smokingAllowed')?.value) {
                      <div class="animate-in fade-in slide-in-from-top-2">
                        <textarea
                          formControlName="smokingPolicyDescription"
                          rows="2"
                          placeholder="Chi tiết quy định hút thuốc..."
                          class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm transition-all"
                        ></textarea>
                      </div>
                    }
                  </div>

                  <div class="flex flex-col gap-3">
                    <label
                      class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all"
                      [ngClass]="
                        editForm.get('petsAllowed')?.value
                          ? 'border-blue-400 bg-blue-50/30'
                          : 'border-slate-200 hover:bg-slate-50'
                      "
                    >
                      <span class="text-sm font-bold text-slate-800">Cho phép thú cưng</span>
                      <div class="relative inline-flex items-center">
                        <input type="checkbox" formControlName="petsAllowed" class="sr-only peer" />
                        <div
                          class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
                        ></div>
                      </div>
                    </label>
                    @if (editForm.get('petsAllowed')?.value) {
                      <div class="animate-in fade-in slide-in-from-top-2">
                        <textarea
                          formControlName="petPolicyDescription"
                          rows="2"
                          placeholder="Chi tiết quy định thú cưng..."
                          class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm transition-all"
                        ></textarea>
                      </div>
                    }
                  </div>

                  <div class="flex flex-col gap-3 md:col-span-2">
                    <label
                      class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all"
                      [ngClass]="
                        editForm.get('childrenAllowed')?.value
                          ? 'border-blue-400 bg-blue-50/30'
                          : 'border-slate-200 hover:bg-slate-50'
                      "
                    >
                      <div>
                        <span class="text-sm font-bold text-slate-800 block"
                          >Phù hợp với trẻ em</span
                        >
                        <span class="text-[11px] text-slate-500"
                          >Gia đình có trẻ nhỏ được chào đón</span
                        >
                      </div>
                      <div class="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          formControlName="childrenAllowed"
                          class="sr-only peer"
                        />
                        <div
                          class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
                        ></div>
                      </div>
                    </label>
                    @if (editForm.get('childrenAllowed')?.value) {
                      <div class="animate-in fade-in slide-in-from-top-2">
                        <textarea
                          formControlName="childrenPolicyDescription"
                          rows="2"
                          placeholder="Ghi chú về trẻ em..."
                          class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm transition-all"
                        ></textarea>
                      </div>
                    }
                  </div>
                </div>
              </div>

              <div class="p-6 rounded-2xl border border-slate-200 space-y-6">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-1 h-5 bg-emerald-500 rounded-full"></div>
                  <h3 class="text-lg font-bold text-slate-800">
                    Chính sách Hủy phòng & Thanh toán
                  </h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-3 md:col-span-2">
                    <label
                      class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all"
                      [ngClass]="
                        editForm.get('allowFreeCancellation')?.value
                          ? 'border-emerald-400 bg-emerald-50/30'
                          : 'border-slate-200 hover:bg-slate-50'
                      "
                    >
                      <div>
                        <span
                          class="text-sm font-bold block"
                          [ngClass]="
                            editForm.get('allowFreeCancellation')?.value
                              ? 'text-emerald-700'
                              : 'text-slate-800'
                          "
                          >Cho phép hủy miễn phí</span
                        >
                        <span class="text-[11px] text-slate-500">Thu hút nhiều khách hàng hơn</span>
                      </div>
                      <div class="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          formControlName="allowFreeCancellation"
                          class="sr-only peer"
                        />
                        <div
                          class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"
                        ></div>
                      </div>
                    </label>
                    @if (editForm.get('allowFreeCancellation')?.value) {
                      <div
                        class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2"
                      >
                        <div class="flex flex-col gap-1.5">
                          <label class="text-xs font-semibold text-slate-600"
                            >Hủy miễn phí trước (ngày)</label
                          >
                          <input
                            type="number"
                            formControlName="freeCancellationDays"
                            class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all"
                          />
                        </div>
                        <div class="flex flex-col gap-1.5">
                          <label class="text-xs font-semibold text-slate-600"
                            >Mô tả chính sách hủy</label
                          >
                          <input
                            type="text"
                            formControlName="cancellationPolicyDescription"
                            class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                    }
                  </div>

                  <div class="flex flex-col gap-3">
                    <label
                      class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all"
                      [ngClass]="
                        editForm.get('requiresPrepayment')?.value
                          ? 'border-amber-400 bg-amber-50/30'
                          : 'border-slate-200 hover:bg-slate-50'
                      "
                    >
                      <span class="text-sm font-bold text-slate-800">Yêu cầu thanh toán trước</span>
                      <div class="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          formControlName="requiresPrepayment"
                          class="sr-only peer"
                        />
                        <div
                          class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"
                        ></div>
                      </div>
                    </label>
                    @if (editForm.get('requiresPrepayment')?.value) {
                      <div class="animate-in fade-in slide-in-from-top-2">
                        <textarea
                          formControlName="prepaymentPolicy"
                          rows="2"
                          placeholder="VD: Cần chuyển khoản trước 50%..."
                          class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none text-sm transition-all"
                        ></textarea>
                      </div>
                    }
                  </div>

                  <div class="flex flex-col gap-3">
                    <label
                      class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all"
                      [ngClass]="
                        editForm.get('securityDepositRequired')?.value
                          ? 'border-amber-400 bg-amber-50/30'
                          : 'border-slate-200 hover:bg-slate-50'
                      "
                    >
                      <span class="text-sm font-bold text-slate-800">Yêu cầu đặt cọc hư hại</span>
                      <div class="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          formControlName="securityDepositRequired"
                          class="sr-only peer"
                        />
                        <div
                          class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"
                        ></div>
                      </div>
                    </label>
                    @if (editForm.get('securityDepositRequired')?.value) {
                      <div class="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2">
                        <input
                          type="number"
                          formControlName="securityDepositAmount"
                          placeholder="Số tiền cọc (VNĐ)"
                          class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none transition-all"
                        />
                        <input
                          type="text"
                          formControlName="securityDepositDescription"
                          placeholder="Mô tả cọc..."
                          class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none text-sm transition-all"
                        />
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-4 border-t border-slate-200">
            <button
              type="button"
              (click)="onSubmit()"
              class="px-8 py-3 bg-[#1ea4e9] hover:bg-[#1891d4] text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      }
    </app-modal>
  `,
})
export class PropertyEditModalComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() propertyDetail: any = null;

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();

  editForm!: FormGroup;
  timeOptions: string[] = [];

  editAmenitiesList = [
    { key: 'pool', label: 'Hồ bơi' },
    { key: 'parking', label: 'Bãi đỗ xe' },
    { key: 'sauna', label: 'Xông hơi' },
    { key: 'spa', label: 'Spa' },
    { key: 'non_smoking', label: 'Không hút thuốc' },
    { key: 'wifi', label: 'Wifi' },
    { key: 'airport_transfer', label: 'Đưa đón sân bay' },
    { key: 'pets', label: 'Thú cưng' },
    { key: 'gym', label: 'Phòng Gym' },
    { key: 'smoking_area', label: 'Khu vực hút thuốc' },
    { key: 'reception_24h', label: 'Lễ tân 24/24' },
    { key: 'ac', label: 'Điều hòa' },
  ];

  ngOnInit() {
    this.generateTimeOptions();
    this.initEditForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['propertyDetail'] && this.propertyDetail && this.editForm) {
      this.populateForm();
    }
  }

  initEditForm() {
    this.editForm = this.fb.group({
      propertyName: ['', Validators.required],
      description: [''],
      area: [0],

      amenities: this.fb.group({
        pool: [false],
        parking: [false],
        sauna: [false],
        spa: [false],
        non_smoking: [false],
        wifi: [false],
        airport_transfer: [false],
        pets: [false],
        gym: [false],
        smoking_area: [false],
        reception_24h: [false],
        ac: [false],
      }),

      checkInTime: [''],
      checkOutTime: [''],
      quietHours: [''],
      minimumAge: [18],
      allowFreeCancellation: [false],
      freeCancellationDays: [0],
      cancellationPolicyDescription: [''],
      securityDepositRequired: [false],
      securityDepositAmount: [0],
      securityDepositDescription: [''],
      requiresPrepayment: [false],
      prepaymentPolicy: [''],
      petsAllowed: [false],
      petPolicyDescription: [''],
      smokingAllowed: [false],
      smokingPolicyDescription: [''],
      childrenAllowed: [false],
      childrenPolicyDescription: [''],
    });
  }

  populateForm() {
    const data = this.propertyDetail;
    console.log('[DEBUG] Dữ liệu chi tiết propertyDetail:', data);

    // 1. Gán các trường Text, Number, Boolean cơ bản
    this.editForm.patchValue({
      propertyName: data.propertyName || '',
      description: data.description || '',
      area: data.area || 0,
      checkInTime: data.checkInTime || '',
      checkOutTime: data.checkOutTime || '',
      quietHours: data.quietHours || '',
      minimumAge: data.minimumAge || 18,
      allowFreeCancellation: data.allowFreeCancellation || false,
      freeCancellationDays: data.freeCancellationDays || 0,
      cancellationPolicyDescription: data.cancellationPolicyDescription || '',
      securityDepositRequired: data.securityDepositRequired || false,
      securityDepositAmount: data.securityDepositAmount || 0,
      securityDepositDescription: data.securityDepositDescription || '',
      requiresPrepayment: data.requiresPrepayment || false,
      prepaymentPolicy: data.prepaymentPolicy || '',
      petsAllowed: data.petsAllowed || false,
      petPolicyDescription: data.petPolicyDescription || '',
      smokingAllowed: data.smokingAllowed || false,
      smokingPolicyDescription: data.smokingPolicyDescription || '',
      childrenAllowed: data.childrenAllowed || false,
      childrenPolicyDescription: data.childrenPolicyDescription || '',
    });

    // 2. Map Array JSON Amenities thành Form Checkbox
    const amGroup = this.editForm.get('amenities') as FormGroup;
    // Reset hết về false
    Object.keys(amGroup.controls).forEach((key) => amGroup.get(key)?.setValue(false));

    // Tích true những tiện ích có trong mảng trả về
    if (data.amenities && Array.isArray(data.amenities)) {
      data.amenities.forEach((item: any) => {
        if (amGroup.get(item.amenityName)) {
          amGroup.get(item.amenityName)?.setValue(true);
        }
      });
    }
  }

  generateTimeOptions() {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        this.timeOptions.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
  }

  get isTimeInvalid(): boolean {
    if (!this.editForm) return false;
    const checkIn = this.editForm.get('checkInTime')?.value;
    const checkOut = this.editForm.get('checkOutTime')?.value;
    return checkIn && checkOut && checkOut <= checkIn ? true : false;
  }

  onSubmit() {
    if (this.editForm.invalid) {
      alert('Vui lòng nhập đủ các trường bắt buộc!');
      return;
    }

    const payload = this.editForm.value;
    payload.amenities = Object.keys(payload.amenities).filter(
      (key) => payload.amenities[key] === true,
    );

    // Gửi lên cha để call API
    this.save.emit(payload);

    // Đóng Modal
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}
