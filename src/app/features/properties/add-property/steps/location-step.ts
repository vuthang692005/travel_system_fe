import { Component, Input, AfterViewInit, OnDestroy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as mapboxgl from 'mapbox-gl';
import { MapboxService } from '../../../../core/services/mapbox.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-location-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
      [formGroup]="group"
    >
      <div>
        <h2 class="text-2xl font-black text-slate-800">Vị trí chỗ nghỉ</h2>
        <p class="text-slate-500 text-sm mt-1">
          Nhập địa chỉ cụ thể hoặc kéo thả ghim trên bản đồ để hệ thống tự động nhận diện khu vực.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
        <div class="flex flex-col gap-1 md:col-span-2 relative">
          <label class="font-semibold text-slate-700 text-sm">Địa chỉ cụ thể (Tìm kiếm) *</label>
          <div class="relative">
            <input
              formControlName="address"
              placeholder="VD: 123 Đường Xuân Thủy, Cầu Giấy..."
              class="w-full p-3 pl-10 bg-white rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
            />
            <svg
              class="absolute left-3 top-[14px] w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>

          @if (suggestions().length > 0) {
            <ul
              class="absolute top-[75px] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto"
            >
              @for (item of suggestions(); track item.id) {
                <li
                  (click)="selectSuggestion(item)"
                  class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                >
                  <p class="font-bold text-slate-800">{{ item.text }}</p>
                  <p class="text-xs text-slate-500 truncate">{{ item.place_name }}</p>
                </li>
              }
            </ul>
          }
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-slate-700 text-sm">Quốc gia</label>
          <input
            formControlName="country"
            readonly
            class="p-3 bg-slate-100 text-slate-500 cursor-not-allowed rounded-xl border border-slate-200 outline-none"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-slate-700 text-sm">Tỉnh / Thành phố *</label>
          <input
            formControlName="province"
            readonly
            placeholder="Tự động điền"
            class="p-3 bg-slate-100 text-slate-600 font-medium cursor-not-allowed rounded-xl border border-slate-200 outline-none"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-slate-700 text-sm">Quận / Huyện *</label>
          <input
            formControlName="city"
            readonly
            placeholder="Tự động điền"
            class="p-3 bg-slate-100 text-slate-600 font-medium cursor-not-allowed rounded-xl border border-slate-200 outline-none"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-slate-700 text-sm">Phường / Xã</label>
          <input
            formControlName="ward"
            readonly
            placeholder="Tự động điền"
            class="p-3 bg-slate-100 text-slate-600 font-medium cursor-not-allowed rounded-xl border border-slate-200 outline-none"
          />
        </div>
      </div>

      <div class="mt-4 flex flex-col gap-2 relative z-10">
        <label class="font-semibold text-slate-700 text-sm">Xác nhận trên bản đồ *</label>
        <div
          class="w-full h-[350px] bg-slate-200 rounded-2xl border border-slate-300 relative overflow-hidden shadow-inner"
        >
          <div id="property-map" class="w-full h-full"></div>
        </div>
      </div>
    </div>
  `,
})
export class LocationStepComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() group!: FormGroup;

  private mapboxService = inject(MapboxService);
  private map!: mapboxgl.Map;
  private marker!: mapboxgl.Marker;

  suggestions = signal<any[]>([]);
  private isSelecting = false; // Cờ chặn gọi API khi đang tự động điền

  ngOnInit() {
    // Lắng nghe người dùng gõ vào ô "Địa chỉ cụ thể"
    this.group
      .get('address')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(async (query) => {
        // Chỉ gọi API tìm kiếm nếu người dùng tự gõ (không phải do click chọn Gợi ý)
        if (query && query.length > 2 && !this.isSelecting) {
          const results = await this.mapboxService.searchAddress(query);
          this.suggestions.set(results || []);
        } else {
          this.suggestions.set([]);
        }
      });
  }

  ngAfterViewInit() {
    const initialLat = this.group.get('latitude')?.value || 21.0278;
    const initialLng = this.group.get('longitude')?.value || 105.8342;

    // Khởi tạo bản đồ
    this.map = this.mapboxService.initMap('property-map', [initialLng, initialLat]);

    // Fix lỗi bản đồ không full kích thước lúc mới load
    setTimeout(() => {
      this.map.resize();
    }, 2000);

    // Khởi tạo Marker
    this.marker = new mapboxgl.Marker({
      color: '#2563EB',
      draggable: true,
    })
      .setLngLat([initialLng, initialLat])
      .addTo(this.map);

    // Lắng nghe kéo Marker
    this.marker.on('dragend', () => {
      const lngLat = this.marker.getLngLat();
      this.updateLocationFromCoords(lngLat.lng, lngLat.lat, true);
    });

    // Lắng nghe click Map
    this.map.on('click', (e) => {
      const lngLat = e.lngLat;
      this.marker.setLngLat([lngLat.lng, lngLat.lat]);
      this.updateLocationFromCoords(lngLat.lng, lngLat.lat, true);
    });
  }

  // Khi người dùng click chọn 1 địa chỉ từ danh sách gợi ý
  selectSuggestion(feature: any) {
    this.isSelecting = true; // Bật cờ chặn auto-search
    this.suggestions.set([]); // Ẩn dropdown

    const lng = feature.center[0];
    const lat = feature.center[1];

    // Cập nhật tên đường vào ô input (Dùng emitEvent: false để không trigger valueChanges)
    this.group.patchValue({ address: feature.place_name }, { emitEvent: false });

    // Bay bản đồ đến đó
    this.map.flyTo({
      center: [lng, lat],
      zoom: 15,
      essential: true,
    });

    // Di chuyển Marker
    this.marker.setLngLat([lng, lat]);

    // Lấy thông tin Tỉnh/Quận/Phường
    this.updateLocationFromCoords(lng, lat, false);

    // Tắt cờ sau 200ms
    setTimeout(() => (this.isSelecting = false), 200);
  }

  // Hàm Reverse Geocoding: Tọa độ -> Tỉnh/Quận/Phường
  // updateAddressField: true nếu kéo thả map thì ghi đè luôn ô Address, false nếu click từ Gợi ý thì giữ nguyên Address
  async updateLocationFromCoords(lng: number, lat: number, updateAddressField: boolean) {
    this.group.patchValue({ latitude: lat, longitude: lng });

    const addressInfo = await this.mapboxService.getAddressFromCoords(lng, lat);

    if (addressInfo) {
      this.group.patchValue(
        {
          province: addressInfo.province || '',
          city: addressInfo.district || '',
          ward: addressInfo.ward || '',
          ...(updateAddressField ? { address: addressInfo.fullAddress || '' } : {}),
        },
        { emitEvent: false },
      );
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
