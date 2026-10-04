export interface Tenant {
  id: string;
  fullName: string;
  email: string;
  documentId: string;
}

export interface TenantRequest {
  fullName: string;
  email: string;
  documentId: string;
}
