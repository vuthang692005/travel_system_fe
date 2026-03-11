import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';
import {
  ApiResponse,
  OwnerApplication,
  ReviewOwnerRequest,
} from '../../core/models/owner-application.model';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OwnerApplicationService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private apiUrl = `${environment.apiUrl}/admin/owner-applications`;

  /**
   * Lấy danh sách hồ sơ đăng ký
   */
  getApplications(status?: string) {
    const url = status ? `${this.apiUrl}?status=${status}` : this.apiUrl;
    return this.http.get<ApiResponse<OwnerApplication[]>>(url).pipe(
      map((res) => {
        if (res.success) {
          return res.data; // Trả về mảng data trực tiếp cho Component
        }
        throw new Error(res.message || 'Lấy dữ liệu thất bại');
      }),
      catchError((error) => {
        // Chỉ thông báo lỗi qua Toast
        const errorMsg = error.error?.message || 'Không thể kết nối đến máy chủ';
        this.toast.show(errorMsg, 'error');
        return throwError(() => error);
      }),
    );
  }

  reviewApplication(
    id: number,
    request: ReviewOwnerRequest,
  ): Observable<ApiResponse<OwnerApplication>> {
    return this.http.post<ApiResponse<OwnerApplication>>(`${this.apiUrl}/${id}/review`, request);
  }
}
