import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Contract, ContractRequest } from '../models/contract';
import { LeaseStatus } from '../models/lease-status';
import { Payment, PaymentRequest } from '../models/payment';
import { Penalty } from '../models/penalty';

@Injectable({ providedIn: 'root' })
export class ContractService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/contracts`;

  list(status?: LeaseStatus): Observable<Contract[]> {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get<Contract[]>(this.baseUrl, { params });
  }

  get(id: string): Observable<Contract> {
    return this.http.get<Contract>(`${this.baseUrl}/${id}`);
  }

  create(request: ContractRequest): Observable<Contract> {
    return this.http.post<Contract>(this.baseUrl, request);
  }

  activate(id: string): Observable<Contract> {
    return this.http.post<Contract>(`${this.baseUrl}/${id}/activate`, {});
  }

  terminate(id: string): Observable<Contract> {
    return this.http.post<Contract>(`${this.baseUrl}/${id}/terminate`, {});
  }

  renew(id: string): Observable<Contract> {
    return this.http.post<Contract>(`${this.baseUrl}/${id}/renew`, {});
  }

  listPayments(contractId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/${contractId}/payments`);
  }

  schedulePayment(contractId: string, request: PaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}/${contractId}/payments`, request);
  }

  penalty(contractId: string, asOf?: string): Observable<Penalty> {
    const params = asOf ? new HttpParams().set('asOf', asOf) : undefined;
    return this.http.get<Penalty>(`${this.baseUrl}/${contractId}/penalty`, { params });
  }
}
