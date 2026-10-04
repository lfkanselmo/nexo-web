import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Property, PropertyRequest } from '../models/property';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/properties`;

  list(): Observable<Property[]> {
    return this.http.get<Property[]>(this.baseUrl);
  }

  create(request: PropertyRequest): Observable<Property> {
    return this.http.post<Property>(this.baseUrl, request);
  }
}
