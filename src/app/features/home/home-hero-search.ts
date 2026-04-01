import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent, SearchPayload } from './components/search-bar'; // Nhớ import
import { Router } from '@angular/router'; // Thêm Router

@Component({
  selector: 'app-home-hero-search',
  standalone: true,
  imports: [CommonModule, SearchBarComponent], // Khai báo
  template: `
    <div
      class="relative w-full h-[750px] flex flex-col items-center justify-center font-sans mt-[-80px]"
    >
      <img
        src="/LuxuryResortPool.avif"
        alt="Hero Background"
        class="absolute inset-0 w-full h-full object-cover object-center blur-[3px]"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>

      <div class="relative z-10 text-center text-white px-4 mt-16">
        <h1
          class="text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight mb-4 drop-shadow-lg"
        >
          Đánh thức hành trình <br />
          <span class="text-[#38bdf8]">đẳng cấp</span>
        </h1>
        <p class="text-sm md:text-base font-medium text-slate-200 drop-shadow-md max-w-2xl mx-auto">
          Khám phá bộ sưu tập khách sạn, resort và homestay độc đáo nhất Việt Nam.<br />
          Trải nghiệm đẳng cấp chỉ với một cú chạm.
        </p>
      </div>

      <div class="relative z-20 w-full max-w-6xl px-4 mt-10">
        <app-search-bar (onSearch)="handleSearch($event)"></app-search-bar>
      </div>
    </div>
  `,
})
export class HomeHeroSearchComponent {
  private router = inject(Router);

  // Chỉ còn duy nhất một hàm này để hứng kết quả
  handleSearch(payload: SearchPayload) {
    this.router.navigate(['/hotels'], { queryParams: payload });
  }
}
