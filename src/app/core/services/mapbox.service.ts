import { inject, Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastService } from './toast.service'; // Sử dụng toast service có sẵn của bạn
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private map!: mapboxgl.Map;
  private readonly token = environment.mapboxToken;

  constructor() {
    mapboxgl.accessToken = this.token;
  }

  // 1. Khởi tạo bản đồ
  initMap(containerId: string, center: [number, number] = [105.8342, 21.0278]): mapboxgl.Map {
    this.map = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center, // Mặc định Hà Nội
      zoom: 13,
    });

    this.map.addControl(new mapboxgl.NavigationControl());
    return this.map;
  }

  // 2. Vẽ Marker với HTML Custom
  addMarker(lng: number, lat: number, htmlContent: string) {
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(htmlContent);

    new mapboxgl.Marker({ color: '#FF0000' }).setLngLat([lng, lat]).setPopup(popup).addTo(this.map);
  }

  // 3. Geocoding ngược: Tọa độ -> Địa chỉ chi tiết (Chỉ Việt Nam)
  async getAddressFromCoords(lng: number, lat: number) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${this.token}&languages=vi`;

    try {
      const res: any = await firstValueFrom(this.http.get(url));
      const feature = res.features[0];

      if (!feature) throw new Error('Không tìm thấy địa chỉ');

      // Kiểm tra quốc gia
      const country = feature.context?.find((c: any) => c.id.includes('country'));
      if (country?.short_code !== 'vn' && country?.text !== 'Vietnam') {
        this.toast.show('Dịch vụ chỉ hỗ trợ khu vực Việt Nam!', 'error');
        return null;
      }

      const region = feature.context.find((c: any) => c.id.includes('region'));
      const locality = feature.context.find((c: any) => c.id.includes('locality'));
      const place = feature.context.find((c: any) => c.id.includes('place'));
      const neighborhood = feature.context.find((c: any) => c.id.includes('neighborhood'));
      let addressDetail = null;

      if (!region) {
        addressDetail = {
          fullAddress: feature.place_name,
          ward: neighborhood?.text || '',
          district: locality?.text || '',
          province: place?.text || '',
        };
      } else {
        addressDetail = {
          fullAddress: feature.place_name,
          ward: locality?.text || '',
          district: place?.text || '',
          province: region?.text || '',
        };
      }

      return addressDetail;
    } catch (error) {
      this.toast.show('Lỗi khi lấy thông tin địa chỉ', 'error');
      return null;
    }
  }

  // 4. Tìm kiếm địa chỉ (Forward Geocoding)
  async searchAddress(query: string) {
    if (!query) return [];

    // Thêm limit=10 để lấy nhiều gợi ý hơn
    // types=address,place,locality để lọc các loại địa điểm cụ thể ở VN
    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
      `access_token=${this.token}&country=vn&languages=vi&autocomplete=true&limit=10`;

    const res: any = await firstValueFrom(this.http.get(url));
    return res.features; // Trả về mảng các địa chỉ gợi ý
  }

  // 5. Lấy tâm và bán kính (Dùng cho chức năng tìm quanh đây)
  getMapBoundsInfo() {
    const center = this.map.getCenter();
    const bounds = this.map.getBounds();

    // Tính bán kính (từ tâm đến góc Bắc Đông) - đơn vị km
    const centerLatLng = new mapboxgl.LngLat(center.lng, center.lat);
    const neLatLng = bounds?.getNorthEast();
    if (!neLatLng) return { lat: center.lat, lng: center.lng, radius: 0 };

    // Công thức tính khoảng cách đơn giản giữa 2 tọa độ (bán kính vùng nhìn thấy)
    const radiusInKm = centerLatLng.distanceTo(neLatLng) / 1000;

    return {
      lat: center.lat,
      lng: center.lng,
      radius: radiusInKm,
    };
  }

  // Lắng nghe sự kiện tương tác
  onMapMoveEnd(callback: (data: any) => void) {
    this.map.on('moveend', () => {
      callback(this.getMapBoundsInfo());
    });
  }
}
