import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'auth-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="text-center mb-8">
      <div class="inline-block p-4 bg-opacity-20 rounded-full mb-4">
        <mat-icon class="scale-180 w-8 h-8 text-black">{{ icon }}</mat-icon>
      </div>
      <h2 class="text-3xl font-bold text-black mb-2">{{ headerTitle }}</h2>
      <p class="text-black text-opacity-80">{{ headerSubtitle }}</p>
    </div>
  `,
})
export class AuthHeader {
  @Input() icon: string = 'icon';
  @Input() headerTitle: string = 'title';
  @Input() headerSubtitle: string = 'subtitle';
}
