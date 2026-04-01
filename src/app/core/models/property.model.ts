export interface PropertyPolicyRequest {
  petsAllowed: boolean;
  petPolicyDescription?: string;
  smokingAllowed: boolean;
  smokingPolicyDescription?: string;
  childrenAllowed: boolean;
  childrenPolicyDescription?: string;
  checkInTime: string;
  checkOutTime: string;
  quietHours?: string;
  allowFreeCancellation: boolean;
  freeCancellationDays?: number;
  cancellationPolicyDescription?: string;
  requiresPrepayment: boolean;
  prepaymentPolicy?: string;
  securityDepositRequired: boolean;
  securityDepositAmount?: number;
  securityDepositDescription?: string;
  minimumAge?: number;
}

export enum PropertyType {
  HOTEL = 'HOTEL',
  HOMESTAY = 'HOMESTAY',
  VILLA = 'VILLA',
  RESORT = 'RESORT',
  // Thêm các loại khác tương ứng với Enum PropertyType ở Backend của bạn
}

export interface PropertyApplicationSubmitDTO {
  propertyType: PropertyType;
  country: string;
  province: string;
  city: string;
  ward?: string;
  provinceCode?: string;
  districtCode?: string;
  price?: number;
  weekendPrice?: number;
  capacity?: number;
  unitName?: string;
  address: string;
  propertyName: string;
  description: string;
  area: number;
  amenities: Record<string, boolean>; // Tương đương Map<String, Boolean> trong Java
  amenitiesRoom?: Record<string, boolean>;
  terms: boolean;
  latitude: number;
  longitude: number;
}

export interface PropertySummary {
  propertyId: number;
  propertyName: string;
  propertyType: string;
  address: string;
  coverImage: string;
  active: boolean;
  propertyStatus: string;
}
