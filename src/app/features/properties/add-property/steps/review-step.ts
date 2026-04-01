import { Component, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PropertyType } from '../../../../core/models/property.model'; // Chỉnh lại đường dẫn cho đúng dự án của bạn

@Component({
  selector: 'app-review-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div class="mb-6">
        <h2 class="text-3xl font-black text-slate-800">Kiểm tra thông tin</h2>
        <p class="text-slate-500 text-base mt-2">
          Vui lòng rà soát kỹ các thông tin dưới đây trước khi gửi yêu cầu đăng ký cơ sở lưu trú.
        </p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <mat-icon class="text-blue-500">domain</mat-icon>
          <h3 class="font-bold text-slate-800 text-lg">Thông tin cơ bản</h3>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Tên cơ sở</span>
            <span class="font-semibold text-slate-800 text-lg">{{
              formData?.details?.propertyName || '---'
            }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Loại hình</span>
            <span
              class="font-semibold text-blue-600 bg-blue-50 w-max px-3 py-1 rounded-full text-sm"
            >
              {{ formData?.propertyType || '---' }}
            </span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >Diện tích (m²)</span
            >
            <span class="font-medium text-slate-700">{{ formData?.details?.area || 0 }} m²</span>
          </div>
          <div class="flex flex-col gap-1 md:col-span-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >Địa chỉ chi tiết</span
            >
            <span class="font-medium text-slate-700">
              {{ formData?.location?.address }}, {{ formData?.location?.ward }},
              {{ formData?.location?.city }}, {{ formData?.location?.province }}
            </span>
          </div>
          <div class="flex flex-col gap-1 md:col-span-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >Mô tả tổng quan</span
            >
            <span class="font-medium text-slate-600 whitespace-pre-line leading-relaxed">{{
              formData?.details?.description || 'Không có mô tả'
            }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <mat-icon class="text-blue-500">photo_library</mat-icon>
          <h3 class="font-bold text-slate-800 text-lg">
            Hình ảnh cơ sở ({{ previewUrls.length }})
          </h3>
        </div>
        <div class="p-6">
          @if (previewUrls.length > 0) {
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              @for (url of previewUrls; track url) {
                <div
                  class="aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                >
                  <img
                    [src]="url"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    alt="Property Image"
                  />
                </div>
              }
            </div>
          } @else {
            <div
              class="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300"
            >
              <span class="text-slate-400 font-medium">Chưa có hình ảnh nào được tải lên</span>
            </div>
          }
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <mat-icon class="text-blue-500">spa</mat-icon>
          <h3 class="font-bold text-slate-800 text-lg">Tiện nghi chung (Toàn khu)</h3>
        </div>
        <div class="p-6">
          @if (activeGeneralAmenities.length > 0) {
            <div class="flex flex-wrap gap-2.5">
              @for (amenity of activeGeneralAmenities; track amenity) {
                <span
                  class="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm rounded-full flex items-center gap-1.5"
                >
                  <mat-icon class="text-emerald-500 scale-75">check_circle</mat-icon> {{ amenity }}
                </span>
              }
            </div>
          } @else {
            <span class="text-slate-500 italic">Không có tiện nghi chung nào được chọn.</span>
          }
        </div>
      </div>

      @if (isHomestayOrVilla) {
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center gap-2">
            <mat-icon class="text-blue-600">bed</mat-icon>
            <h3 class="font-bold text-blue-900 text-lg">Chi tiết Nguyên Căn (Phòng)</h3>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="flex flex-col gap-1 md:col-span-3">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Tên căn</span>
              <span class="font-bold text-slate-800 text-xl">{{
                formData?.unit?.unitName || '---'
              }}</span>
            </div>

            <div class="flex flex-col gap-1 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                >Giá ngày thường</span
              >
              <span class="font-bold text-blue-600 text-lg">{{
                formData?.unit?.price | currency: 'VND' : 'symbol' : '1.0-0'
              }}</span>
            </div>
            <div class="flex flex-col gap-1 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                >Giá cuối tuần</span
              >
              <span class="font-bold text-orange-500 text-lg">{{
                formData?.unit?.weekendPrice | currency: 'VND' : 'symbol' : '1.0-0'
              }}</span>
            </div>
            <div class="flex flex-col gap-1 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                >Sức chứa</span
              >
              <span class="font-bold text-slate-700 text-lg"
                >{{ formData?.unit?.capacity }} Người</span
              >
            </div>

            <div class="md:col-span-3 mt-4 border-t border-slate-100 pt-6">
              <span class="text-sm font-bold text-slate-800 mb-3 block">Tiện nghi trong căn:</span>
              @if (activeUnitAmenities.length > 0) {
                <div class="flex flex-wrap gap-2.5">
                  @for (amenity of activeUnitAmenities; track amenity) {
                    <span
                      class="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-800 font-medium text-sm rounded-lg flex items-center gap-1.5"
                    >
                      <mat-icon class="scale-75">done</mat-icon> {{ amenity }}
                    </span>
                  }
                </div>
              } @else {
                <span class="text-slate-500 italic">Không có tiện nghi phòng nào được chọn.</span>
              }
            </div>
          </div>
        </div>
      }

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <mat-icon class="text-blue-500">gavel</mat-icon>
          <h3 class="font-bold text-slate-800 text-lg">Quy định & Chính sách</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-xl">
            <div>
              <span class="text-xs font-bold text-slate-400 uppercase block mb-1">Nhận phòng</span>
              <span class="font-semibold text-slate-800">{{
                formData?.policies?.checkInTime || '--:--'
              }}</span>
            </div>
            <div>
              <span class="text-xs font-bold text-slate-400 uppercase block mb-1">Trả phòng</span>
              <span class="font-semibold text-slate-800">{{
                formData?.policies?.checkOutTime || '--:--'
              }}</span>
            </div>
            <div>
              <span class="text-xs font-bold text-slate-400 uppercase block mb-1"
                >Độ tuổi tối thiểu</span
              >
              <span class="font-semibold text-slate-800"
                >{{ formData?.policies?.minimumAge }} tuổi</span
              >
            </div>
            @if (formData?.policies?.quietHours) {
              <div class="md:col-span-3 pt-3 border-t border-slate-200 mt-2">
                <span class="text-xs font-bold text-slate-400 uppercase block mb-1"
                  >Giờ yên tĩnh (Giới nghiêm)</span
                >
                <span class="font-semibold text-slate-800">{{
                  formData?.policies?.quietHours
                }}</span>
              </div>
            }
          </div>

          <div class="space-y-4">
            <div class="flex gap-3 pb-4 border-b border-slate-100 last:border-0">
              <mat-icon
                [class]="formData?.policies?.petsAllowed ? 'text-emerald-500' : 'text-red-400'"
              >
                {{ formData?.policies?.petsAllowed ? 'check_circle' : 'cancel' }}
              </mat-icon>
              <div>
                <span class="font-semibold text-slate-800 block">Thú cưng</span>
                @if (formData?.policies?.petsAllowed) {
                  <p class="text-sm text-slate-600 mt-1">
                    {{
                      formData?.policies?.petPolicyDescription || 'Được phép mang theo thú cưng.'
                    }}
                  </p>
                } @else {
                  <p class="text-sm text-slate-500 mt-1">Không cho phép mang theo thú cưng.</p>
                }
              </div>
            </div>

            <div class="flex gap-3 pb-4 border-b border-slate-100 last:border-0">
              <mat-icon
                [class]="formData?.policies?.smokingAllowed ? 'text-emerald-500' : 'text-red-400'"
              >
                {{ formData?.policies?.smokingAllowed ? 'check_circle' : 'cancel' }}
              </mat-icon>
              <div>
                <span class="font-semibold text-slate-800 block">Hút thuốc</span>
                @if (formData?.policies?.smokingAllowed) {
                  <p class="text-sm text-slate-600 mt-1">
                    {{ formData?.policies?.smokingPolicyDescription || 'Được phép hút thuốc.' }}
                  </p>
                } @else {
                  <p class="text-sm text-slate-500 mt-1">Nghiêm cấm hút thuốc.</p>
                }
              </div>
            </div>

            <div class="flex gap-3 pb-4 border-b border-slate-100 last:border-0">
              <mat-icon
                [class]="formData?.policies?.childrenAllowed ? 'text-emerald-500' : 'text-red-400'"
              >
                {{ formData?.policies?.childrenAllowed ? 'check_circle' : 'cancel' }}
              </mat-icon>
              <div>
                <span class="font-semibold text-slate-800 block">Trẻ em & Giường phụ</span>
                @if (formData?.policies?.childrenAllowed) {
                  <p class="text-sm text-slate-600 mt-1">
                    {{ formData?.policies?.childrenPolicyDescription || 'Phù hợp cho trẻ em.' }}
                  </p>
                } @else {
                  <p class="text-sm text-slate-500 mt-1">Không phù hợp cho trẻ em.</p>
                }
              </div>
            </div>

            <div class="flex gap-3 pb-4 border-b border-slate-100 last:border-0">
              <mat-icon
                [class]="
                  formData?.policies?.allowFreeCancellation ? 'text-emerald-500' : 'text-slate-400'
                "
              >
                {{ formData?.policies?.allowFreeCancellation ? 'check_circle' : 'info' }}
              </mat-icon>
              <div>
                <span class="font-semibold text-slate-800 block">Chính sách hủy phòng</span>
                @if (formData?.policies?.allowFreeCancellation) {
                  <p class="text-sm text-slate-600 mt-1">
                    Miễn phí hủy phòng trước
                    <strong>{{ formData?.policies?.freeCancellationDays }}</strong> ngày. <br />
                    <span class="text-slate-500">{{
                      formData?.policies?.cancellationPolicyDescription
                    }}</span>
                  </p>
                } @else {
                  <p class="text-sm text-slate-500 mt-1">
                    Không hỗ trợ hủy phòng miễn phí (Non-refundable).
                  </p>
                }
              </div>
            </div>

            <div class="flex gap-3 pb-4 border-b border-slate-100 last:border-0">
              <mat-icon class="text-amber-500">payments</mat-icon>
              <div class="space-y-3 w-full">
                <span class="font-semibold text-slate-800 block">Thanh toán & Đặt cọc</span>

                @if (formData?.policies?.requiresPrepayment) {
                  <div class="bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <span class="text-xs font-bold text-amber-800 uppercase block"
                      >Yêu cầu trả trước</span
                    >
                    <p class="text-sm text-amber-900 mt-1">
                      {{ formData?.policies?.prepaymentPolicy }}
                    </p>
                  </div>
                }

                @if (formData?.policies?.securityDepositRequired) {
                  <div class="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span class="text-xs font-bold text-slate-500 uppercase block"
                      >Cọc đề phòng hư hại</span
                    >
                    <p class="text-sm font-semibold text-slate-800 mt-1">
                      {{
                        formData?.policies?.securityDepositAmount
                          | currency: 'VND' : 'symbol' : '1.0-0'
                      }}
                    </p>
                    <p class="text-sm text-slate-600">
                      {{ formData?.policies?.securityDepositDescription }}
                    </p>
                  </div>
                }

                @if (
                  !formData?.policies?.requiresPrepayment &&
                  !formData?.policies?.securityDepositRequired
                ) {
                  <p class="text-sm text-slate-500">Không yêu cầu thanh toán trước hay đặt cọc.</p>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-2xl shadow-sm">
        <label class="flex items-start gap-4 cursor-pointer group">
          <input
            type="checkbox"
            [formControl]="termsControl"
            class="mt-1 w-6 h-6 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <span
            class="text-sm text-slate-700 leading-relaxed font-medium group-hover:text-slate-900 transition-colors"
          >
            Tôi xác nhận rằng mọi thông tin đã cung cấp ở trên là hoàn toàn chính xác. Bằng việc
            nhấn hoàn tất, tôi đồng ý với các
            <a href="#" class="text-blue-600 font-bold hover:underline">Điều khoản dịch vụ</a> và
            <a href="#" class="text-blue-600 font-bold hover:underline">Chính sách bảo mật</a> của
            nền tảng.
          </span>
        </label>
      </div>
    </div>
  `,
})
export class ReviewStepComponent implements OnChanges, OnDestroy {
  @Input() formData: any;
  @Input() images: File[] = [];
  @Input() termsControl!: FormControl;

  previewUrls: string[] = [];

  // Map key -> tên tiếng việt cho Tiện ích chung
  generalAmenityLabels: Record<string, string> = {
    pool: 'Hồ bơi',
    parking: 'Bãi đỗ xe',
    sauna: 'Phòng xông hơi',
    spa: 'Spa & Massage',
    non_smoking: 'Khu không hút thuốc',
    wifi: 'Wi-Fi miễn phí',
    airport_transfer: 'Đưa đón sân bay',
    pets: 'Cho phép thú cưng',
    gym: 'Phòng Gym',
    smoking_area: 'Khu vực hút thuốc',
    reception_24h: 'Lễ tân 24/7',
    ac: 'Điều hòa trung tâm',
  };

  // Map key -> tên tiếng việt cho Tiện ích phòng
  unitAmenityLabels: Record<string, string> = {
    tv: 'TV',
    ac: 'Điều hòa riêng',
    minibar: 'Minibar',
    tea_coffee: 'Trà/Cà phê',
    wifi: 'Wifi tốc độ cao',
    bathtub: 'Bồn tắm',
    balcony: 'Ban công',
    non_smoking: 'Phòng không hút thuốc',
  };

  // Lắng nghe khi mảng File[] (images) từ Parent thay đổi để tạo link Preview Image thật
  ngOnChanges(changes: SimpleChanges) {
    if (changes['images'] && this.images) {
      this.clearPreviews();
      this.previewUrls = this.images.map((file) => URL.createObjectURL(file));
    }
  }

  // Dọn dẹp RAM khi component bị hủy
  ngOnDestroy() {
    this.clearPreviews();
  }

  private clearPreviews() {
    this.previewUrls.forEach((url) => URL.revokeObjectURL(url));
    this.previewUrls = [];
  }

  // --- CÁC GETTER HỖ TRỢ RENDER --- //

  get isHomestayOrVilla(): boolean {
    const type = this.formData?.propertyType;
    return type === PropertyType.HOMESTAY || type === PropertyType.VILLA;
  }

  // Chỉ lấy những tiện ích chung đang được tích true
  get activeGeneralAmenities(): string[] {
    if (!this.formData?.amenities) return [];
    return Object.keys(this.formData.amenities)
      .filter((key) => this.formData.amenities[key] === true)
      .map((key) => this.generalAmenityLabels[key] || key);
  }

  // Chỉ lấy những tiện ích phòng đang được tích true (chỉ dùng cho Homestay/Villa)
  get activeUnitAmenities(): string[] {
    if (!this.formData?.unit?.amenities) return [];
    return Object.keys(this.formData.unit.amenities)
      .filter((key) => this.formData.unit.amenities[key] === true)
      .map((key) => this.unitAmenityLabels[key] || key);
  }
}
