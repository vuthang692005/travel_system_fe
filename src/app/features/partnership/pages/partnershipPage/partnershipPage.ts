import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AppButton } from '../../../../shared/components/button';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { UserStore } from '../../../../store/user.store';

@Component({
  standalone: true,
  imports: [MatIconModule, AppButton],
  templateUrl: './partnership-page.html',
})
export class PartnershipPage {
  constructor(
    private router: Router,
    private confirmService: ConfirmService,
    private userStore: UserStore,
  ) {}

  // Danh sách các đặc quyền tóm tắt
  perks = signal([
    { icon: 'handshake', text: 'Hợp tác minh bạch, bền vững' },
    { icon: 'trending_up', text: 'Tăng trưởng doanh thu đột phá' },
    { icon: 'public', text: 'Tiếp cận thị trường toàn cầu' },
  ]);

  // Logic khi nhấn nút Đăng ký ngay
  async onRegister() {
    const user = this.userStore.user();

    const dob = new Date(user?.dateOfBirth || '');
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

    if (
      this.userStore.isLoggedIn() &&
      (!user?.fullName?.trim() ||
        !user?.phoneNumber?.trim() ||
        !user?.dateOfBirth?.trim() ||
        !user?.gender?.trim())
    ) {
      const isConfirmed = await this.confirmService.confirm({
        title: 'Hồ sơ chưa hoàn thiện',
        message:
          'Bạn cần cập nhật đầy đủ thông tin cá nhân (Họ tên, SĐT, Ngày sinh, Giới tính) để có thể đăng ký hợp tác. Cập nhật ngay?',
        icon: 'account_circle', // Icon về hồ sơ người dùng
        confirmText: 'Cập nhật',
        cancelText: 'Để sau',
      });

      if (isConfirmed) {
        this.router.navigate(['/profile']);
      }
    } else if (age < 18) {
      const isConfirmed = await this.confirmService.confirm({
        title: 'Hẹn gặp bạn trong tương lai',
        message:
          'Rất tiếc! Để đảm bảo các thủ tục pháp lý khi ký kết hợp đồng, chương trình đối tác của BVTRAVEL chỉ áp dụng cho cá nhân từ đủ 18 tuổi trở lên. Hẹn sớm gặp lại bạn nhé!',
        icon: 'info', // Chuyển sang info để nhẹ nhàng hơn warning
        confirmText: 'Tôi đã hiểu',
        cancelText: 'Đóng',
      });
    } else if (!this.userStore.isLoggedIn()) {
      const isConfirmed = await this.confirmService.confirm({
        title: 'Yêu cầu đăng nhập',
        message: 'Vui lòng đăng nhập tài khoản BVTRAVEL để bắt đầu quy trình đăng ký hợp tác.',
        icon: 'login', // Icon đăng nhập
        confirmText: 'Đăng nhập',
        cancelText: 'Hủy',
      });

      if (isConfirmed) {
        this.router.navigate(['/auth']);
      }
    } else {
      this.router.navigate(['/partnershipForm']);
    }
  }
}
