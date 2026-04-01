import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Nhớ trỏ đúng đường dẫn

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);

  // Lấy URL gốc từ environment và nối thêm '/payments'
  private apiUrl = `${environment.apiUrl}/payments`;

  /**
   * Gọi API Thanh toán đơn đặt phòng
   */
  submitPayment(bookingId: number, method: string, note?: string): Observable<any> {
    // Dùng HttpParams để build query string gọn gàng hơn
    let params = new HttpParams().set('method', method);

    if (note) {
      params = params.set('note', note);
    }

    return this.http.post<any>(`${this.apiUrl}/${bookingId}/pay`, null, { params });
  }
}
