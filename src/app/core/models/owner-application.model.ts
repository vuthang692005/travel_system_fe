export interface OwnerApplication {
  id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  permanentAddress: string;
  hometownAddress: string;
  cardFrontImage: string;
  cardBackImage: string;
  businessLicenseImage: string;
  businessLicenseNumber: string;
  createdAt: string;
  reviewedAt: string | null;
  adminReason: string | null;
  applicantId: string;
  applicantFullName: string;
  applicantEmail: string;
  applicantPhoneNumber: string;
  applicantAvatar: string;
  applicantDob: string;
  personalIdCard: string;
  reviewedByAdminName: string | null;
}

export interface ReviewOwnerRequest {
  status: 'APPROVED' | 'REJECTED';
  reason?: string;
  validForReview: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
