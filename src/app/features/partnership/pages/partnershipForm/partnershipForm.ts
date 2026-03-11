import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UserStore } from '../../../../store/user.store';
import { AppButton } from '../../../../shared/components/button';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PartnershipService } from '../../../../core/services/partnership.service'; // Import service mới
import { ToastService } from '../../../../core/services/toast.service'; // Import toast để báo lỗi
import { finalize } from 'rxjs';

export interface PartnershipForm {
  personalFullName: string;
  personalEmail: string;
  personalPhone: string;
  personalIdCard: string;
  personalDob: string;
  hometownAddress: string;
  permanentAddress: string;
  cardFrontImage: File | null;
  cardBackImage: File | null;
  businessLicenseNumber: string;
  businessLicenseImage: File | null;
}

@Component({
  standalone: true,
  imports: [MatIconModule, AppButton, RouterLink],
  templateUrl: './partnership-form.html',
})
export class PartnershipForms {
  private userStore = inject(UserStore);
  private sanitizer = inject(DomSanitizer);
  private partnershipService = inject(PartnershipService); // Inject service
  private toast = inject(ToastService); // Inject toast

  currentStep = signal(1);
  isSubmitting = signal(false);
  errors = signal<Record<string, string>>({});

  formData = signal<PartnershipForm>({
    personalFullName: this.userStore.user()?.fullName || '',
    personalEmail: this.userStore.user()?.email || '',
    personalPhone: this.userStore.user()?.phoneNumber || '', // Đồng bộ với UserStore
    personalIdCard: '',
    personalDob: this.userStore.user()?.dateOfBirth || '',
    hometownAddress: '',
    permanentAddress: '',
    cardFrontImage: null,
    cardBackImage: null,
    businessLicenseNumber: '',
    businessLicenseImage: null,
  });

  previews = signal({
    cardFrontImage: '' as SafeUrl | string,
    cardBackImage: '' as SafeUrl | string,
    businessLicenseImage: '' as SafeUrl | string,
  });

  selectedPreviewImage = signal<SafeUrl | string | null>(null);

  toggleLightbox(url: SafeUrl | string | null) {
    this.selectedPreviewImage.set(url);
  }

  updateField(field: keyof PartnershipForm, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.formData.update((prev) => ({ ...prev, [field]: value }));
    // Xóa lỗi ngay khi người dùng nhập lại
    if (this.errors()[field]) {
      this.errors.update((prev) => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  }

  onFileChange(field: 'cardFrontImage' | 'cardBackImage' | 'businessLicenseImage', event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files?.length) {
      const file = element.files[0];

      if (!file.type.startsWith('image/')) {
        this.errors.update((prev) => ({
          ...prev,
          [field]: 'Chỉ được phép tải lên tệp hình ảnh (jpg, png...)',
        }));
        return;
      }

      this.formData.update((prev) => ({ ...prev, [field]: file }));
      const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      this.previews.update((prev) => ({ ...prev, [field]: url }));

      this.errors.update((prev) => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  }

  validateStep(step: number): boolean {
    const data = this.formData();
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!/^\d{12}$/.test(data.personalIdCard)) {
        newErrors['personalIdCard'] = 'Số CCCD phải gồm 12 số tự nhiên';
      }

      if (!data.personalDob) {
        newErrors['personalDob'] = 'Vui lòng chọn ngày sinh';
      } else {
        const dob = new Date(data.personalDob);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        if (age < 18) newErrors['personalDob'] = 'Bạn phải trên 18 tuổi';
      }

      if (!data.hometownAddress.trim())
        newErrors['hometownAddress'] = 'Quê quán không được để trống';
      if (!data.permanentAddress.trim())
        newErrors['permanentAddress'] = 'Địa chỉ thường trú không được để trống';
      if (!data.cardFrontImage) newErrors['cardFrontImage'] = 'Thiếu ảnh mặt trước CCCD';
      if (!data.cardBackImage) newErrors['cardBackImage'] = 'Thiếu ảnh mặt sau CCCD';
    }

    if (step === 2) {
      if (!/^\d+$/.test(data.businessLicenseNumber)) {
        newErrors['businessLicenseNumber'] = 'Mã số kinh doanh chỉ được chứa số';
      }
      if (!data.businessLicenseImage)
        newErrors['businessLicenseImage'] = 'Thiếu ảnh giấy phép kinh doanh';
    }

    this.errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  next() {
    if (this.validateStep(this.currentStep())) {
      if (this.currentStep() < 4) this.currentStep.update((s) => s + 1);
      window.scrollTo(0, 0);
    }
  }

  back() {
    if (this.currentStep() > 1) this.currentStep.update((s) => s - 1);
  }

  onSubmit() {
    if (this.validateStep(this.currentStep())) {
      this.isSubmitting.set(true);
      console.log('Form data to submit:', this.formData());

      const data = this.formData();
      // Khởi tạo FormData để gửi cả text và file
      const payload = new FormData();

      // 1. Append các trường văn bản (string)
      payload.append('personalFullName', data.personalFullName);
      payload.append('personalEmail', data.personalEmail);
      payload.append('personalPhone', data.personalPhone);
      payload.append('personalIdCard', data.personalIdCard);
      payload.append('personalDob', data.personalDob);
      payload.append('hometownAddress', data.hometownAddress);
      payload.append('permanentAddress', data.permanentAddress);
      payload.append('businessLicenseNumber', data.businessLicenseNumber);

      // 2. Append các file (Binary)
      if (data.cardFrontImage) {
        payload.append('cardFrontImage', data.cardFrontImage);
      }
      if (data.cardBackImage) {
        payload.append('cardBackImage', data.cardBackImage);
      }
      if (data.businessLicenseImage) {
        payload.append('businessLicenseImage', data.businessLicenseImage);
      }

      // Gọi service kết nối API
      this.partnershipService
        .submitOwnerApplication(payload)
        .pipe(
          finalize(() => this.isSubmitting.set(false)), // Tắt loading dù thành công hay lỗi
        )
        .subscribe({
          next: (res) => {
            // Giả sử API trả về success: true theo cấu trúc ApiResponse
            if (res.success || res.status === 'PENDING') {
              this.currentStep.set(4); // Chuyển sang bước thành công
              window.scrollTo(0, 0);
            }
          },
          error: (err) => {
            // Hiển thị thông báo lỗi từ backend hoặc lỗi mặc định
            const errorMsg = err.error?.message || 'Có lỗi xảy ra khi gửi hồ sơ. Vui lòng thử lại!';
            this.toast.show(errorMsg, 'error');
          },
        });
    }
  }
}
