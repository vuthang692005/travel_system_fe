import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NavItem } from '../../core/models/nav-item.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <aside class="w-60 bg-white border-r border-gray-100 flex flex-col z-50 shadow-sm h-full">
      <div class="p-6 h-17 flex items-center border-b border-gray-50">
        <a routerLink="/"><img src="/logo.png" alt="TravelMate" class="h-8 cursor-pointer" /></a>
      </div>

      <nav class="flex-1 px-2 py-4 overflow-y-auto space-y-1 scrollbar-hide">
        @for (item of menuItems; track item.label) {
          <div>
            <a
              [routerLink]="item.path ? item.path : null"
              (click)="toggleSubMenu(item)"
              routerLinkActive="bg-blue-50 !text-blue-600 shadow-sm"
              [routerLinkActiveOptions]="{ exact: true }"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 font-medium hover:bg-gray-50 transition-all cursor-pointer group"
            >
              <mat-icon class="scale-90">{{ item.icon }}</mat-icon>
              <span class="text-[14px] flex-1">{{ item.label }}</span>

              @if (item.children) {
                <mat-icon
                  class="text-xs transition-transform duration-300"
                  [class.rotate-180]="item.isOpen"
                >
                  expand_more
                </mat-icon>
              }
            </a>

            <div
              class="grid transition-all duration-300 ease-in-out overflow-hidden"
              [style.grid-template-rows]="item.children && item.isOpen ? '1fr' : '0fr'"
              [style.opacity]="item.children && item.isOpen ? '1' : '0'"
            >
              <div class="min-h-0">
                <div class="mt-1 ml-4 border-l-2 border-gray-100 pl-2 space-y-1 py-1">
                  @for (child of item.children; track child.label) {
                    <a
                      [routerLink]="child.path"
                      routerLinkActive="text-blue-600 font-bold"
                      class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 text-sm hover:text-slate-700 transition-colors"
                    >
                      <mat-icon class="text-xs">{{ child.icon }}</mat-icon>
                      <span>{{ child.label }}</span>
                    </a>
                  }
                </div>
              </div>
            </div>
          </div>
        }
      </nav>
    </aside>
  `,
})
export class Sidebar {
  @Input() menuItems: NavItem[] = [];

  toggleSubMenu(item: NavItem) {
    if (item.children) {
      item.isOpen = !item.isOpen;
    }
  }
}
