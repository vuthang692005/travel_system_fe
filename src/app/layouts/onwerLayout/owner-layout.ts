import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar';
import { NavItem } from '../../core/models/nav-item.model';
import { Header } from '../../shared/components/header';

@Component({
  selector: 'app-onwer-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Header],
  template: `
    <div class="flex h-screen bg-slate-50 overflow-hidden">
      <app-sidebar [menuItems]="ownerMenu" />

      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />

        <main class="flex-1 overflow-y-auto p-5">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class OwnerLayout {
  ownerMenu: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', path: '/owner/dashboard' },

    { label: 'Thông báo', icon: 'notifications', path: '/owner/notifications' },

    { label: 'Khuyến mãi', icon: 'percent', path: '/owner/promotions' },

    { label: 'Đặt phòng', icon: 'event_available', path: '/owner/bookings' },

    {
      label: 'Quản lý cơ sở lưu trú',
      icon: 'business',
      isOpen: false,
      children: [
        { label: 'Danh sách cơ sở', icon: 'list_alt', path: '/owner/hotels' },
        { label: 'Thêm cơ sở', icon: 'add_business', path: '/owner/hotels/create' },
      ],
    },
    { label: 'Cơ sở lưu trú', icon: 'hotel', path: '/owner/hotels' },
  ];
}
