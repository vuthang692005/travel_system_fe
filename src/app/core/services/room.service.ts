import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/rooms`;

  // Lấy danh sách phòng theo ID của cơ sở lưu trú
  getRoomsByProperty(propertyId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/property/${propertyId}`);
  }

  addRoom(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, formData);
  }

  updateRoom(roomId: number, formData: FormData): Observable<any> {
    // Tùy theo method BE quy định, thường cập nhật là PUT hoặc PATCH
    return this.http.put<any>(`${this.apiUrl}/${roomId}`, formData);
  }
}
