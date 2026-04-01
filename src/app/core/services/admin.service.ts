import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;

  // API lấy danh sách user có hỗ trợ phân trang và tìm kiếm
  getUsers(page: number, size: number, keyword?: string, rank?: string): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (keyword) params = params.set('keyword', keyword);
    if (rank) params = params.set('rank', rank);

    return this.http.get<any>(`${this.apiUrl}/users`, { params });
  }

  updateUserStatus(userId: string, status: string, reason?: string): Observable<any> {
    let params = new HttpParams().set('status', status);

    if (reason) {
      params = params.set('reason', reason);
    }

    return this.http.patch<any>(`${this.apiUrl}/users/${userId}/status`, null, { params });
  }
}
