import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bookings`;

  /**
   * Gọi API tạo mới đơn đặt phòng
   */
  createBooking(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, payload);
  }

  getRoomAvailability(roomId: number): Observable<any> {
    // Gọi API lấy danh sách [{start: "2023-12-01", end: "2023-12-05"}, ...]
    return this.http.get<any>(`${this.apiUrl}/room/${roomId}/availability`);
  }

  getBookingsByProperty(propertyId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/property/${propertyId}`);
  }

  // API Check-in
  // Cần cấu hình responseType: 'text' vì API chỉ trả về chuỗi String
  checkInBooking(bookingId: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${bookingId}/check-in`, {}, { responseType: 'text' });
  }

  // API Check-out
  checkOutBooking(bookingId: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/checkout/${bookingId}`, {}, { responseType: 'text' });
  }
}
