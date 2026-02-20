import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PartnershipService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/applications`;

  /**
   * Gửi hồ sơ đăng ký đối tác (Chủ sở hữu)
   * @param formData Đối tượng FormData chứa các trường text và file
   */
  submitOwnerApplication(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit-owner`, formData);
  }
}
