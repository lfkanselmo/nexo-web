import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tenant, TenantRequest } from '../models/tenant';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/tenants`;

  list(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(this.baseUrl);
  }

  create(request: TenantRequest): Observable<Tenant> {
    return this.http.post<Tenant>(this.baseUrl, request);
  }
}
