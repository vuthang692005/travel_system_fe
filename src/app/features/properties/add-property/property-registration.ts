import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { ToastService } from '../../../core/services/toast.service';
import { PropertyType } from '../../../core/models/property.model';
import { finalize, switchMap } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { AmenitiesStepComponent } from './steps/amenities-step';
import { DetailsStepComponent } from './steps/details-step';
import { LocationStepComponent } from './steps/location-step';
import { PropertyTypeStepComponent } from './steps/property-type-step';
import { ReviewStepComponent } from './steps/review-step';
import { UnitSetupStepComponent } from './steps/unit-setup-step';
import { ImagesStepComponent } from './steps/images-step';
import { PolicyStepComponent } from './steps/policy-step';
import { AppButton } from '../../../shared/components/button';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-property-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    AmenitiesStepComponent,
    DetailsStepComponent,
    LocationStepComponent,
    PropertyTypeStepComponent,
    ReviewStepComponent,
    UnitSetupStepComponent,
    ImagesStepComponent,
    PolicyStepComponent,
    AppButton,
  ],
  templateUrl: './property-registration.html',
})
export class PropertyRegistrationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private propertyService = inject(PropertyService);
  private toast = inject(ToastService);
  private router = inject(Router);

  // --- WIZARD STATE ---
  currentStepIndex = signal(0);
  isSubmitting = signal(false);
  uploadedImages = signal<File[]>([]);

  // Định nghĩa toàn bộ các bước có thể có
  private readonly ALL_STEPS = [
    { key: 'type', label: 'Loại hình', icon: 'apartment' },
    { key: 'location', label: 'Vị trí', icon: 'location_on' },
    { key: 'amenities', label: 'Tiện nghi', icon: 'pool' },
    { key: 'images', label: 'Hình ảnh', icon: 'image' },
    { key: 'details', label: 'Chi tiết cơ sở', icon: 'info' },
    { key: 'policies', label: 'Chính sách', icon: 'policy' },
    { key: 'unit', label: 'Thiết lập căn', icon: 'bed' }, // Bước có điều kiện
    { key: 'review', label: 'Kiểm tra lại', icon: 'fact_check' },
  ];

  // --- REACTIVE FORM STATE ---
  registrationForm = this.fb.group({
    propertyType: [null as PropertyType | null, Validators.required],
    location: this.fb.group({
      country: ['Vietnam', Validators.required],
      province: ['', Validators.required],
      city: ['', Validators.required],
      ward: [''],
      address: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
    }),
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
    details: this.fb.group({
      propertyName: ['', Validators.required],
      description: [''],
      area: [0, [Validators.required, Validators.min(1)]],
    }),
    policies: this.fb.group({
      checkInTime: ['', Validators.required],
      checkOutTime: ['', Validators.required],
      quietHours: [''],
      minimumAge: [18], // Mặc định 18 tuổi

      petsAllowed: [false],
      petPolicyDescription: [''],

      smokingAllowed: [false],
      smokingPolicyDescription: [''],

      childrenAllowed: [false],
      childrenPolicyDescription: [''],

      allowFreeCancellation: [false],
      freeCancellationDays: [0],
      cancellationPolicyDescription: [''],

      requiresPrepayment: [false],
      prepaymentPolicy: [''],

      securityDepositRequired: [false],
      securityDepositAmount: [0],
      securityDepositDescription: [''],
    }),
    // FormArray cho Units (Nhiều căn)
    unit: this.fb.group({
      unitName: ['', Validators.required],
      price: [0, Validators.required],
      weekendPrice: [0],
      capacity: [1, Validators.required],
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
    }),
    terms: [false, Validators.requiredTrue],
  });

  propertyTypeSignal = toSignal(this.registrationForm.controls.propertyType.valueChanges, {
    initialValue: this.registrationForm.controls.propertyType.value,
  });

  // --- DYNAMIC STEPS LOGIC ---
  activeSteps = computed(() => {
    // Đọc giá trị từ Signal. Khi form đổi -> Signal đổi -> computed tự chạy lại ngay lập tức!
    const type = this.propertyTypeSignal();

    // Nếu là Khách sạn/Resort -> Bỏ bước "Thiết lập căn"
    if (type === PropertyType.HOTEL || type === PropertyType.RESORT) {
      return this.ALL_STEPS.filter((step) => step.key !== 'unit');
    }
    return this.ALL_STEPS;
  });

  currentStep = computed(() => this.activeSteps()[this.currentStepIndex()]);
  isLastStep = computed(() => this.currentStepIndex() === this.activeSteps().length - 1);

  ngOnInit() {
    this.loadAutoSave();

    // Auto-save form value changes
    this.registrationForm.valueChanges.subscribe((val) => {
      localStorage.setItem('draft_property', JSON.stringify(val));
    });
  }

  // --- NAVIGATION ---
  nextStep() {
    // Validate current section before moving
    const currentControlKey = this.currentStep().key;
    const currentControl = this.registrationForm.get(currentControlKey);

    if (currentControlKey === 'images' && this.uploadedImages().length < 3) {
      this.toast.show('Vui lòng tải lên ít nhất 3 hình ảnh', 'error');
      return;
    }

    if (currentControl && currentControl.invalid) {
      currentControl.markAllAsTouched();
      this.toast.show('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
      return;
    }

    if (!this.isLastStep()) {
      this.currentStepIndex.update((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep() {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.update((i) => i - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // --- SUBMIT FLOW ---
  onSubmit() {
    if (this.registrationForm.value.terms !== true) {
      this.toast.show('Vui lòng đồng ý với các điều khoản!', 'error');
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.registrationForm.value as any;

    const isHomestayOrVilla =
      formValue.propertyType === PropertyType.HOMESTAY ||
      formValue.propertyType === PropertyType.VILLA;

    // 1. Build Payload cho submitApplication()
    const applicationPayload = {
      propertyType: formValue.propertyType,

      country: formValue.location.country,
      province: formValue.location.province,
      city: formValue.location.city,
      address: formValue.location.address,
      latitude: formValue.location.latitude,
      longitude: formValue.location.longitude,
      ward: formValue.location.ward,

      propertyName: formValue.details.propertyName,
      description: formValue.details.description,
      area: formValue.details.area,

      price: isHomestayOrVilla ? formValue.unit.price : null,
      weekendPrice: isHomestayOrVilla ? formValue.unit.weekendPrice : null,
      capacity: isHomestayOrVilla ? formValue.unit.capacity : null,
      unitName: isHomestayOrVilla ? formValue.unit.unitName : null,
      amenitiesRoom: isHomestayOrVilla ? formValue.unit.amenities : null,

      amenities: formValue.amenities,
      terms: formValue.terms,
    };

    // 2. Gọi chuỗi API sử dụng switchMap
    this.propertyService
      .submitApplication(applicationPayload, this.uploadedImages())
      .pipe(
        switchMap((res: any) => {
          const newPropertyId = res.data.propertyId; // Lấy ID từ response API đầu tiên
          const policyPayload = formValue.policies;
          // Gọi API thứ 2
          return this.propertyService.submitPolicies(newPropertyId, policyPayload);
        }),
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe({
        next: () => {
          this.toast.show('Đăng ký cơ sở lưu trú thành công!', 'success');
          localStorage.removeItem('draft_property');
          this.router.navigate(['/owner/hotels']); // Về trang quản lý
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Có lỗi xảy ra', 'error');
        },
      });
  }

  // Optional: Restore form state
  loadAutoSave() {
    const draft = localStorage.getItem('draft_property');
    if (draft) {
      this.registrationForm.patchValue(JSON.parse(draft));
    }
  }
}
