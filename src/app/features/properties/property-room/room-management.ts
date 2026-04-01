import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../../core/services/room.service'; // Chỉnh đường dẫn
import { ToastService } from '../../../core/services/toast.service';
import { RoomFormModalComponent } from './components/room-form-modal'; // Giả sử bạn có component này để tạo/sửa phòng

export interface RoomSummary {
  roomId: number;
  roomName: string;
  capacity: number;
  image: string;
  pricePerNight: number;
  weekendPrice: number;
  description: string;
  amenities: string[];
  area: number;
  roomCategory: string;
}

@Component({
  selector: 'app-room-management',
  standalone: true,
  imports: [CommonModule, RoomFormModalComponent],
  template: `
    <div class="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans pb-20">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-200"
      >
        <div class="flex items-center gap-4">
          <button
            (click)="goBack()"
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-[#1ea4e9] transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-black text-slate-800">Quản lý phòng</h1>
              <span class="text-2xl font-black text-slate-300">|</span>
              <span class="text-xl font-bold text-[#1ea4e9]">Cơ sở #{{ propertyId }}</span>
            </div>
            <p class="text-sm text-slate-500 font-medium mt-1">
              Thiết lập các loại phòng và giá cho cơ sở này
            </p>
          </div>
        </div>

        <button
          (click)="openAddRoomModal()"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1ea4e9] hover:bg-[#1891d4] text-white rounded-xl font-bold transition-all shadow-sm active:scale-95"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Thêm phòng mới
        </button>
      </div>

      @if (isLoading) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (i of [1, 2, 3, 4]; track i) {
            <div
              class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-pulse h-[340px]"
            >
              <div class="h-48 w-full bg-slate-200"></div>
              <div class="p-4 flex-1 space-y-4">
                <div class="h-5 bg-slate-200 rounded w-2/3"></div>
                <div class="space-y-2">
                  <div class="h-4 bg-slate-200 rounded w-full"></div>
                  <div class="h-4 bg-slate-200 rounded w-4/5"></div>
                </div>
                <div class="h-10 bg-slate-200 rounded-xl w-full mt-auto"></div>
              </div>
            </div>
          }
        </div>
      } @else if (rooms.length === 0) {
        <div
          class="bg-white p-12 md:p-20 rounded-3xl border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center h-[500px]"
        >
          <div class="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <svg
              class="w-12 h-12 text-[#1ea4e9]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <h3 class="text-2xl font-black text-slate-800 mb-2">Chưa có phòng nào</h3>
          <p class="text-slate-500 mb-8 max-w-md mx-auto">
            Hãy tạo các hạng phòng để khách hàng có thể bắt đầu đặt lịch tại cơ sở của bạn.
          </p>
          <button
            (click)="openAddRoomModal()"
            class="px-6 py-3 border-2 border-[#1ea4e9] text-[#1ea4e9] font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
          >
            Tạo phòng đầu tiên
          </button>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          @for (room of rooms; track room.roomId) {
            <div
              class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col group"
            >
              <div class="relative h-48 w-full bg-slate-100 overflow-hidden shrink-0">
                <img
                  [src]="room.image"
                  [alt]="room.roomName"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  (error)="handleImageError($event)"
                />

                <div
                  class="absolute top-3 left-3 px-2.5 py-1.5 bg-white/90 backdrop-blur-md rounded-lg flex items-center gap-1.5 text-slate-700 shadow-sm border border-slate-100"
                >
                  <svg
                    class="w-4 h-4 text-[#1ea4e9]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span class="text-xs font-bold">{{ room.capacity }} người</span>
                </div>
              </div>

              <div class="p-5 flex-1 flex flex-col">
                <h3
                  class="text-lg font-black text-slate-800 mb-4 line-clamp-1 group-hover:text-[#1ea4e9] transition-colors"
                  [title]="room.roomName"
                >
                  {{ room.roomName }}
                </h3>

                <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2.5 mb-5">
                  <div class="flex justify-between items-center">
                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wide"
                      >Ngày thường</span
                    >
                    <div class="text-right">
                      <span class="font-black text-[#1ea4e9]"
                        >{{ formatPrice(room.pricePerNight) }} ₫</span
                      >
                      <span class="text-[10px] text-slate-400 font-medium">/đêm</span>
                    </div>
                  </div>

                  <div class="h-px w-full bg-slate-200 border-dashed"></div>

                  <div class="flex justify-between items-center">
                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wide"
                      >Cuối tuần</span
                    >
                    <div class="text-right">
                      <span class="font-black text-rose-500"
                        >{{ formatPrice(room.weekendPrice) }} ₫</span
                      >
                      <span class="text-[10px] text-slate-400 font-medium">/đêm</span>
                    </div>
                  </div>
                </div>

                <div class="mt-auto grid grid-cols-4 gap-3">
                  <button
                    (click)="openEditRoomModal(room)"
                    class="col-span-3 flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 hover:text-[#1ea4e9] transition-colors text-sm"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Sửa phòng
                  </button>
                  <button
                    class="col-span-1 flex items-center justify-center py-2 border border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
    <app-room-form-modal
      [(isOpen)]="isRoomModalOpen"
      [propertyId]="propertyId"
      [roomData]="selectedRoomData"
      (save)="handleSaveRoom($event)"
    >
    </app-room-form-modal>
  `,
})
export class RoomManagementComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private roomService = inject(RoomService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  propertyId!: number;
  rooms: RoomSummary[] = [];
  isLoading = true;
  isRoomModalOpen = false;
  selectedRoomData: any = null;

  openAddRoomModal() {
    this.selectedRoomData = null; // Báo hiệu là chế độ Thêm
    this.isRoomModalOpen = true;
  }

  openEditRoomModal(room: RoomSummary) {
    // Lý tưởng nhất: Gọi API get detail phòng /api/v1/rooms/{roomId} rồi gán vào đây
    // Hoặc nếu room đã chứa đủ info thì gán luôn:
    this.selectedRoomData = room;
    this.isRoomModalOpen = true;
  }

  // Hứng FormData từ Modal và gọi API
  handleSaveRoom(formData: FormData) {
    console.log('Đã nhận FormData từ Modal Component!');

    if (this.selectedRoomData) {
      const roomId = this.selectedRoomData.roomId;

      this.roomService.updateRoom(roomId, formData).subscribe({
        next: (res) => {
          if (res && res.success) {
            this.toast.show('Cập nhật phòng thành công!', 'success');
            this.fetchRooms(); // Tải lại danh sách phòng để có data mới nhất
          } else {
            this.toast.show(res.message || 'Cập nhật thất bại.', 'error');
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Có lỗi xảy ra, không thể cập nhật.', 'error');
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
    } else {
      this.roomService.addRoom(formData).subscribe({
        next: (res) => {
          if (res && res.success) {
            this.toast.show('Thêm phòng mới thành công!', 'success');
            this.fetchRooms(); // Tải lại danh sách, phòng mới sẽ xuất hiện ngay
          } else {
            this.toast.show(res.message || 'Thêm phòng thất bại.', 'error');
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Có lỗi xảy ra, không thể thêm phòng.', 'error');
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  ngOnInit() {
    // 1. Lấy ID cơ sở từ URL (Ví dụ: /owner/hotels/2)
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.propertyId) {
      this.fetchRooms();
    }
  }

  fetchRooms() {
    this.isLoading = true;
    this.roomService.getRoomsByProperty(this.propertyId).subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          // 2. Map dữ liệu cần thiết để show UI
          this.rooms = res.data.map((r: any) => ({
            roomId: r.roomId,
            roomName: r.roomName,
            capacity: r.capacity,
            image: r.images && r.images.length > 0 ? r.images[0] : '', // Lấy ảnh đầu tiên
            pricePerNight: r.pricePerNight,
            weekendPrice: r.weekendPrice,
            description: r.description,
            amenities: r.amenities,
            area: r.area,
            roomCategory: r.roomCategory,
          }));
        }
        this.isLoading = false;
        this.cdr.detectChanges(); // Ép cập nhật UI
      },
      error: (err) => {
        this.toast.show('Không thể tải dữ liệu phòng', 'error');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // --- UI HELPERS ---

  // Quay lại trang trước
  goBack() {
    this.location.back();
  }

  // Định dạng số tiền (1000000 -> 1.000.000)
  formatPrice(price: number): string {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Xử lý nếu ảnh từ API bị chết
  handleImageError(event: any) {
    event.target.src = 'assets/images/default-room.jpg'; // Thay bằng ảnh mặc định dự án của bạn
  }
}
