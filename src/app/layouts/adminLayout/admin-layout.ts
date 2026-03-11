import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar';
import { NavItem } from '../../core/models/nav-item.model';
import { Header } from '../../shared/components/header';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Header],
  template: `
    <div class="flex h-screen bg-slate-50 overflow-hidden">
      <app-sidebar [menuItems]="adminMenu" />

      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />

        <main class="flex-1 overflow-y-auto p-5">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminLayout {
  adminMenu: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
    { label: 'Quản lý Users', icon: 'group', path: '/admin/users' },
    {
      label: 'Quản lý nơi cư trú',
      icon: 'apartment',
      isOpen: false,
      children: [
        { label: 'Duyệt nơi cư trú', icon: 'rule', path: '/admin/hotels/submissions' },
        { label: 'Danh sách nơi cư trú', icon: 'list', path: '/admin/hotels/list' },
      ],
    },
    {
      label: 'Quản lý dòng tiền',
      icon: 'payments', // rõ nghĩa tiền hơn account_balance_wallet
      isOpen: false,
      children: [
        {
          label: 'Quản lý thanh toán',
          icon: 'receipt_long',
          path: '/admin/payments',
        },
        {
          label: 'Quản lý hoàn tiền',
          icon: 'undo',
          path: '/admin/refunds',
        },
      ],
    },
    { label: 'Quản lý khuyến mãi', icon: 'percent', path: '/admin/promotions' },
    { label: 'Duyệt chủ sở hữu', icon: 'fact_check', path: '/admin/owner-applications' },
    { label: 'Thông báo', icon: 'notifications', path: '/admin/notifications' },
    { label: 'Lịch sử hệ thống', icon: 'history', path: '/admin/system-history' },
  ];
}
