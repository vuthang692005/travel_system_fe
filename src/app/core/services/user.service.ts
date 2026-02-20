import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, UserDetail } from '../models/auth.model'; // Chỉ cần UserDetail
import { UserStore } from '../../store/user.store';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private userStore = inject(UserStore);
  private userUrl = `${environment.apiUrl}/user-details`;

  getCurrentUser(): Observable<UserDetail | null> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.userStore.clearUser();
      return of(null);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Khi status = 200, tap sẽ nhận được body là UserDetail
    return this.http.get<UserDetail>(`${this.userUrl}/me`, { headers }).pipe(
      tap((user) => {
        // Nếu vào được đây nghĩa là HTTP Status là 200 OK
        this.userStore.setUser(user);
      }),
      catchError((error) => {
        // Nếu status != 2xx (ví dụ 401, 403, 500), nó sẽ nhảy vào đây
        console.error('Lỗi lấy thông tin user:', error);
        this.userStore.clearUser();
        return of(null);
      }),
    );
  }

  updateProfile(profileData: any): Observable<ApiResponse<UserDetail>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .put<
        ApiResponse<UserDetail>
      >(`${environment.apiUrl}/user-details/update`, profileData, { headers })
      .pipe(
        tap((res) => {
          if (res.success) {
            // Lưu response.data vào UserStore nếu thành công
            this.userStore.setUser(res.data);
          }
        }),
      );
  }

  getRoles(): string[] {
    const token = localStorage.getItem('token');
    if (!token) return [];
    try {
      const roles = JSON.parse(atob(token.split('.')[1])).roles;
      return roles ? roles.split(',') : [];
    } catch {
      return [];
    }
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }
}
