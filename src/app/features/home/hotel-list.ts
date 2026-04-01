import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchBarComponent, SearchPayload } from './components/search-bar'; // Chỉnh đường dẫn
import { PropertyService } from '../../core/services/property.service'; // Chỉnh đường dẫn

@Component({
  selector: 'app-hotel-list-page',
  standalone: true,
  imports: [CommonModule, SearchBarComponent],
  template: `
    <div class="min-h-screen bg-slate-50/50 pb-20 font-sans py-5">
      <div
        class="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"
      ></div>
      <div class="relative z-40 max-w-[1200px] mx-auto">
        <app-search-bar
          [initPayload]="currentParams"
          (onSearch)="handleNewSearch($event)"
        ></app-search-bar>
      </div>

      <div class="relative z-20 max-w-[1200px] mx-auto p-4">
        <div class="flex flex-col gap-6 min-h-[400px]">
          @if (isLoading) {
            @for (i of [1, 2, 3]; track i) {
              <div
                class="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden animate-pulse h-[240px]"
              >
                <div class="w-full md:w-[300px] h-[200px] md:h-full bg-slate-200 shrink-0"></div>
                <div class="p-6 flex flex-col flex-1 w-full">
                  <div class="h-6 bg-slate-200 rounded w-2/3 mb-3"></div>
                  <div class="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div class="h-4 bg-slate-200 rounded w-1/2 mb-auto"></div>
                  <div class="w-full border-t border-dashed border-slate-200 my-4"></div>
                  <div class="flex justify-between items-end">
                    <div class="space-y-2">
                      <div class="h-3 bg-slate-200 rounded w-20"></div>
                      <div class="h-6 bg-slate-200 rounded w-32"></div>
                    </div>
                    <div class="h-10 bg-slate-200 rounded-xl w-32"></div>
                  </div>
                </div>
              </div>
            }
          } @else if (hotels.length === 0) {
            <div
              class="bg-white rounded-3xl p-12 border-2 border-dashed border-slate-200 shadow-sm flex flex-col items-center justify-center text-center h-[400px]"
            >
              <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <svg
                  class="w-10 h-10 text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-800 mb-2">Không tìm thấy kết quả nào</h3>
              <p class="text-slate-500 max-w-md">
                Hãy thử thay đổi điểm đến, nới lỏng khoảng thời gian hoặc bỏ bớt các bộ lọc để xem
                thêm nhiều lựa chọn khác.
              </p>
            </div>
          } @else {
            @for (hotel of hotels; track hotel.propertyId) {
              <div
                class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row overflow-hidden group"
              >
                <div
                  class="relative w-full md:w-[320px] h-[220px] md:h-auto shrink-0 overflow-hidden bg-slate-100"
                >
                  <img
                    [src]="hotel.coverImage"
                    [alt]="hotel.propertyName"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    (error)="handleImageError($event)"
                  />
                  <div
                    class="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-slate-100"
                  >
                    <span class="text-[11px] font-black text-[#1ea4e9] uppercase tracking-wider">{{
                      hotel.propertyType
                    }}</span>
                  </div>
                </div>

                <div class="p-5 md:p-6 flex flex-col flex-1 justify-between bg-white relative">
                  <div>
                    <h3
                      class="text-[22px] font-black text-slate-800 mb-2 pr-16 group-hover:text-[#1ea4e9] transition-colors cursor-pointer"
                      (click)="goToDetail(hotel.propertyId)"
                    >
                      {{ hotel.propertyName }}
                    </h3>
                    <p
                      class="text-[13px] text-slate-500 flex items-start gap-1.5 line-clamp-2 leading-relaxed"
                    >
                      <svg
                        class="w-4 h-4 text-slate-400 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {{ hotel.address }}
                    </p>
                  </div>

                  <div class="w-full border-t border-dashed border-slate-200 my-5"></div>

                  <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Giá phòng / đêm
                      </p>
                      <div class="flex items-baseline gap-1">
                        <span class="text-[22px] font-black text-[#1ea4e9]">{{
                          formatPriceRange(hotel.minPrice, hotel.maxPrice)
                        }}</span>
                        <span
                          class="text-sm font-bold text-[#1ea4e9] underline decoration-2 underline-offset-4"
                          >đ</span
                        >
                      </div>
                      <p class="text-[11px] font-medium text-slate-400 mt-1">
                        Đã bao gồm thuế & phí
                      </p>
                    </div>

                    <button
                      (click)="goToDetail(hotel)"
                      class="w-full sm:w-auto px-8 py-3 bg-[#1ea4e9] hover:bg-[#0284c7] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                      Xem phòng
                    </button>
                  </div>
                </div>
              </div>
            }
          }
        </div>

        @if (!isLoading && totalPages > 0) {
          <div class="flex items-center justify-center gap-4 mt-12 mb-8">
            <button
              (click)="changePage(currentParams.page - 1)"
              [disabled]="currentParams.page <= 0"
              class="w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-[#1ea4e9] hover:border-blue-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm group"
            >
              <svg
                class="w-6 h-6 group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div
              class="flex flex-col items-center justify-center bg-white px-8 py-2 rounded-2xl border border-slate-200 shadow-sm"
            >
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Trang</span>
              <span class="text-lg font-black text-slate-800"
                >{{ (currentParams.page || 0) + 1 }} / {{ totalPages }}</span
              >
            </div>

            <button
              (click)="changePage((currentParams.page || 0) + 1)"
              [disabled]="currentParams.page >= totalPages - 1"
              class="w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-[#1ea4e9] hover:border-blue-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm group"
            >
              <svg
                class="w-6 h-6 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class HotelListPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private propertyService = inject(PropertyService);
  private cdr = inject(ChangeDetectorRef);

  currentParams: any = { page: 0, size: 10 };

  // Data state
  hotels: any[] = [];
  isLoading = true;
  totalPages = 0;
  totalElements = 0;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.currentParams = { ...params };
      this.currentParams.page = params['page'] ? Number(params['page']) : 0;
      this.currentParams.size = params['size'] ? Number(params['size']) : 10;

      this.fetchHotels();
    });
  }

  fetchHotels() {
    this.isLoading = true;

    // Gọi API
    this.propertyService.searchProperties(this.currentParams).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.hotels = res.data.content || [];
          this.totalPages = res.data.totalPages || 0;
          this.totalElements = res.data.totalElements || 0;
        } else {
          this.hotels = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges(); // Ép cập nhật giao diện
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách khách sạn:', err);
        this.hotels = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // --- LOGIC GIAO DIỆN ---

  formatPriceRange(min: number, max: number): string {
    if (!min && !max) return 'Đang cập nhật';

    const format = (val: number) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Nếu min và max bằng nhau thì chỉ hiện 1 số
    if (min === max) {
      return format(min);
    }

    return `${format(min)} - ${format(max)}`;
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/default-hotel.jpg'; // Nhớ chuẩn bị ảnh mặc định này
  }

  // --- LOGIC TƯƠNG TÁC ---

  goToDetail(property: any) {
    this.router.navigate(['/hotels', property.propertyId], {
      state: { propertyData: property, searchCriteria: this.currentParams },
    });
  }

  handleNewSearch(newPayload: SearchPayload) {
    newPayload.page = 0;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newPayload,
    });
  }

  changePage(newPage: number) {
    if (newPage < 0 || newPage >= this.totalPages) return;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: newPage },
      queryParamsHandling: 'merge',
    });

    // Cuộn lên đầu trang sau khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
