import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'home-footer',
  templateUrl: './footer.html',
  standalone: true,
  imports: [RouterLink],
})
export class Footer {
  contactInfo = [
    {
      icon: 'fa-map-marker-alt',
      text: 'Tầng 12, Tòa nhà Bitexco, Quận 1, TP. Hồ Chí Minh, Việt Nam',
    },
    {
      icon: 'fa-phone-alt',
      text: '1900 1234',
    },
    {
      icon: 'fa-envelope',
      text: 'support@travelmate.vn',
    },
  ];

  aboutLinks = [
    { label: 'Về BVTravel', url: '' },
    { label: 'Tuyển dụng', url: '' },
    { label: 'Điều khoản sử dụng', url: '' },
    { label: 'Chính sách bảo mật', url: '' },
  ];

  supportLinks = [
    { label: 'Trung tâm trợ giúp', url: '' },
    { label: 'Quy định đặt phòng', url: '' },
    { label: 'Liên hệ hỗ trợ', url: '' },
    { label: 'Đăng ký đối tác', url: '' },
  ];

  socialLinks = [
    { icon: 'fa-facebook-f', url: '' },
    { icon: 'fa-instagram', url: '' },
    { icon: 'fa-twitter', url: '' },
    { icon: 'fa-youtube', url: '' },
  ];

  bottomLinks = [
    { label: 'Bảo mật', url: '' },
    { label: 'Điều khoản', url: '' },
    { label: 'Sitemap', url: '' },
  ];

  payments = ['VISA', 'JCB', 'MOMO'];
}
