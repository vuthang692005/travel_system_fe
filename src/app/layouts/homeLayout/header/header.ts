import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'home-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
})
export class Header {
  // Giả lập trạng thái: true là đã đăng nhập, false là chưa
  isLoggedIn: boolean = true;
  HasNotification: boolean = true;
  userName: string = 'FullName';

  navLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Khuyến mãi', path: '/promotion' },
    { label: 'Về chúng tôi', path: '/about' },
  ];
}
