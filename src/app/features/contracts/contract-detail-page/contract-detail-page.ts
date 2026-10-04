import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../../../core/services/contract.service';
import { PropertyService } from '../../../core/services/property.service';
import { TenantService } from '../../../core/services/tenant.service';
import { Contract } from '../../../core/models/contract';
import { LeaseStatus } from '../../../core/models/lease-status';
import { Payment } from '../../../core/models/payment';
import { Penalty } from '../../../core/models/penalty';
import { Property } from '../../../core/models/property';
import { Tenant } from '../../../core/models/tenant';
import { Button } from '../../../shared/components/button/button';
import { PaymentStatusBadge } from '../../../shared/components/payment-status-badge/payment-status-badge';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { TextField } from '../../../shared/components/text-field/text-field';

const ALLOWED_TRANSITIONS: Record<LeaseStatus, LeaseStatus[]> = {
  DRAFT: ['ACTIVE'],
  ACTIVE: ['OVERDUE', 'TERMINATED', 'RENEWAL'],
  OVERDUE: ['ACTIVE', 'TERMINATED'],
  RENEWAL: ['ACTIVE'],
  TERMINATED: [],
};

@Component({
  selector: 'nexo-contract-detail-page',
  standalone: true,
  imports: [FormsModule, DecimalPipe, Button, StatusBadge, PaymentStatusBadge, TextField],
  templateUrl: './contract-detail-page.html',
  styleUrl: './contract-detail-page.scss',
})
export class ContractDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly contractService = inject(ContractService);
  private readonly propertyService = inject(PropertyService);
  private readonly tenantService = inject(TenantService);

  private readonly contractId = this.route.snapshot.paramMap.get('id')!;

  protected readonly contract = signal<Contract | null>(null);
  protected readonly property = signal<Property | null>(null);
  protected readonly tenant = signal<Tenant | null>(null);
  protected readonly payments = signal<Payment[]>([]);
  protected readonly penalty = signal<Penalty | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly working = signal(false);

  protected paymentDueDate = '';
  protected paymentAmount = '';

  constructor() {
    this.loadContract();
    this.loadPayments();
    this.loadPenalty();
  }

  protected canTransitionTo(target: LeaseStatus): boolean {
    const current = this.contract()?.status;
    return !!current && ALLOWED_TRANSITIONS[current].includes(target);
  }

  private loadContract(): void {
    this.contractService.get(this.contractId).subscribe({
      next: (contract) => {
        this.contract.set(contract);
        this.propertyService.list().subscribe((properties) => {
          this.property.set(properties.find((p) => p.id === contract.propertyId) ?? null);
        });
        this.tenantService.list().subscribe((tenants) => {
          this.tenant.set(tenants.find((t) => t.id === contract.tenantId) ?? null);
        });
      },
      error: () => this.errorMessage.set('No se pudo cargar el contrato.'),
    });
  }

  private loadPayments(): void {
    this.contractService.listPayments(this.contractId).subscribe((payments) => this.payments.set(payments));
  }

  private loadPenalty(): void {
    this.contractService.penalty(this.contractId).subscribe((penalty) => this.penalty.set(penalty));
  }

  protected transitionTo(target: 'ACTIVE' | 'TERMINATED' | 'RENEWAL'): void {
    this.working.set(true);
    this.errorMessage.set('');
    this.actionFor(target).subscribe({
      next: (contract) => {
        this.contract.set(contract);
        this.working.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo aplicar el cambio de estado.');
        this.working.set(false);
      },
    });
  }

  private actionFor(target: 'ACTIVE' | 'TERMINATED' | 'RENEWAL') {
    switch (target) {
      case 'ACTIVE':
        return this.contractService.activate(this.contractId);
      case 'TERMINATED':
        return this.contractService.terminate(this.contractId);
      case 'RENEWAL':
        return this.contractService.renew(this.contractId);
    }
  }

  protected schedulePayment(): void {
    if (!this.paymentDueDate || !this.paymentAmount) {
      return;
    }
    this.contractService.schedulePayment(this.contractId, { dueDate: this.paymentDueDate, amount: Number(this.paymentAmount) }).subscribe({
      next: (payment) => {
        this.payments.update((current) => [...current, payment]);
        this.paymentDueDate = '';
        this.paymentAmount = '';
        this.loadPenalty();
      },
      error: () => this.errorMessage.set('No se pudo agendar el pago.'),
    });
  }
}
