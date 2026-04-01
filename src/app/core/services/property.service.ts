import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PropertyPolicyRequest, PropertyApplicationSubmitDTO } from '../models/property.model';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/properties`;
  private adminApiUrl = `${environment.apiUrl}/admin/properties`;

  // 1. API: Submit Application (Multipart/form-data)
  submitApplication(propertyData: PropertyApplicationSubmitDTO, images: File[]): Observable<any> {
    const formData = new FormData();

    // Chuyển đối tượng DTO thành chuỗi JSON để khớp với @RequestPart("propertyData") String ở Backend
    formData.append('propertyData', JSON.stringify(propertyData));

    // Đưa danh sách ảnh vào Multipart
    images.forEach((image) => {
      formData.append('propertyImages', image);
    });

    return this.http.post(`${this.apiUrl}/submit-application`, formData);
  }

  // 2. API: Submit Policies (JSON)
  submitPolicies(propertyId: number, policies: PropertyPolicyRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${propertyId}/policies`, policies);
  }

  //3. API: Get My Properties
  getMyProperties(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-properties`);
  }

  // 4. API: Toggle Property Status
  togglePropertyStatus(propertyId: number): Observable<any> {
    const url = `${this.apiUrl}/${propertyId}/status`;

    return this.http.patch<any>(url, {});
  }

  // 5. API: Get Property Details by ID
  getPropertyById(propertyId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${propertyId}`);
  }

  // 6. API: Update Property (PUT hoặc PATCH)
  updateProperty(propertyId: number, payload: any): Observable<any> {
    // Dùng PUT hoặc PATCH tùy theo Backend của bạn thiết kế (thường là PUT cho full update)
    return this.http.put<any>(`${this.apiUrl}/update/${propertyId}`, payload);
  }

  getAdminPropertiesList(page: number, size: number, status?: string): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (status && status !== 'ALL') {
      params = params.set('status', status);
    }
    return this.http.get<any>(`${this.adminApiUrl}/list`, { params });
  }

  // 7. API: Admin Review Property
  reviewProperty(propertyId: number, payload: { status: string; reason: string }): Observable<any> {
    return this.http.post<any>(`${this.adminApiUrl}/${propertyId}/review`, payload);
  }

  // 8. API: Get My Active Properties
  getMyActiveProperties(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-active-properties`);
  }

  // 9. API: Search Properties
  searchProperties(params: any): Observable<any> {
    // Dọn dẹp các tham số rỗng (null, undefined, '') trước khi gửi
    const cleanParams: any = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });

    return this.http.get<any>(`${this.apiUrl}/search`, { params: cleanParams });
  }
}
