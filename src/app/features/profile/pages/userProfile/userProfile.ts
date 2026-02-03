import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserStore } from '../../../../store/user.store';
import { UserService } from '../../../../core/services/user.service';
import { ToastService } from '../../../../core/services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './userProfile.html',
})
export class UserProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userStore = inject(UserStore);
  private userService = inject(UserService);
  private toast = inject(ToastService);
  isLoading = signal(false);

  profileForm!: FormGroup;

  isGenderOpen = signal(false); // Trạng thái đóng mở dropdown giới tính
  genderOptions = ['Nam', 'Nữ', 'Khác'];

  selectGender(value: string) {
    this.profileForm.get('gender')?.setValue(value);
    this.isGenderOpen.set(false);
  }

  ngOnInit() {
    const user = this.userStore.user(); // Lấy dữ liệu từ store

    this.profileForm = this.fb.group({
      fullName: [user?.fullName || ''],
      phoneNumber: [user?.phoneNumber || ''],
      dateOfBirth: [user?.dateOfBirth || ''],
      gender: [user?.gender || ''],
      city: [user?.city || ''],
      country: [user?.country || ''],
      address: [user?.address || ''],
    });
  }

  onSave() {
    this.isLoading.set(true);

    // Chuẩn bị dữ liệu gửi đi khớp với Request Body của API
    const payload = {
      ...this.profileForm.value,
      // Đảm bảo notificationEmail được gửi kèm nếu backend yêu cầu
      notificationEmail: this.userStore.user()?.email,
    };

    this.userService
      .updateProfile(payload)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.toast.show('Cập nhật dữ liệu cá nhân thành công!', 'success');
          }
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Cập nhật thất bại', 'error');
        },
      });
  }
}
