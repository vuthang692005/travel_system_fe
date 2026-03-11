import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../../../store/user.store';

interface TierBenefit {
  icon: string;
  text: string;
}

interface TierInfo {
  name: string;
  minPoints: number;
  benefits: TierBenefit[];
}

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './membership.html',
})
export class MembershipComponent {
  private userStore = inject(UserStore);

  // Lấy dữ liệu từ Store
  user = this.userStore.user;
  currentPoints = computed(() => this.user()?.points || 0);
  currentRank = computed(() => this.user()?.membershipRank || 'Hạng đồng');
  userName = computed(() => this.user()?.fullName || 'Người dùng');

  // Danh sách các hạng thành viên
  tiers: TierInfo[] = [
    {
      name: 'Hạng đồng',
      minPoints: 0,
      benefits: [
        { icon: 'fa-coins', text: 'Tích điểm 1.000đ = 1 điểm' },
        { icon: 'fa-bell', text: 'Nhận thông báo ưu đãi sớm' },
        { icon: 'fa-percent', text: 'Nhận các ưu đãi, mã giảm giá đặc biệt dựa trên hạng' },
      ],
    },
    {
      name: 'Hạng bạc',
      minPoints: 1000,
      benefits: [
        { icon: 'fa-coins', text: 'Tích điểm 1.000đ = 1.2 điểm' },
        { icon: 'fa-bolt', text: 'Ưu tiên xác nhận đơn đặt phòng' },
        { icon: 'fa-gift', text: 'Quà tặng sinh nhật thành viên' },
      ],
    },
    {
      name: 'Hạng vàng',
      minPoints: 5000,
      benefits: [
        { icon: 'fa-coins', text: 'Tích điểm 1.000đ = 1.5 điểm' },
        { icon: 'fa-hotel', text: 'Nâng hạng phòng miễn phí (nếu có)' },
        { icon: 'fa-coffee', text: 'Miễn phí bữa sáng tại một số đối tác' },
      ],
    },
    {
      name: 'Hạng kim cương',
      minPoints: 10000,
      benefits: [
        { icon: 'fa-coins', text: 'Tích điểm 1.000đ = 2 điểm' },
        { icon: 'fa-headset', text: 'Hỗ trợ khách hàng VIP 24/7' },
        { icon: 'fa-shuttle-van', text: 'Miễn phí xe đưa đón sân bay' },
      ],
    },
  ];

  // Quản lý hạng đang xem quyền lợi
  selectedTierId = signal<string>(this.currentRank());
  selectedTier = computed(
    () => this.tiers.find((t) => t.name === this.selectedTierId()) || this.tiers[0],
  );

  // Tính toán tiến trình thăng hạng
  nextTier = computed(() => this.tiers.find((t) => t.minPoints > this.currentPoints()));
  progressWidth = computed(() => {
    if (!this.nextTier()) return 100;
    return (this.currentPoints() / this.nextTier()!.minPoints) * 100;
  });

  showGoalBox = computed(() => {
    const isDiamond = this.currentRank() === 'DIAMOND';
    const isViewingCurrentRank = this.selectedTierId() === this.currentRank();

    // Chỉ hiện nếu đang xem hạng của chính mình VÀ không phải là Kim Cương
    return isViewingCurrentRank && !isDiamond && this.nextTier();
  });

  selectTier(id: string) {
    this.selectedTierId.set(id);
  }
}
