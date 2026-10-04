import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContractService } from '../../../core/services/contract.service';
import { Contract } from '../../../core/models/contract';
import { LeaseStatus } from '../../../core/models/lease-status';
import { Button } from '../../../shared/components/button/button';
import { SelectField, SelectOption } from '../../../shared/components/select-field/select-field';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';

const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'DRAFT', label: 'Borrador' },
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'OVERDUE', label: 'En mora' },
  { value: 'RENEWAL', label: 'En renovación' },
  { value: 'TERMINATED', label: 'Terminado' },
];

@Component({
  selector: 'nexo-contracts-list-page',
  standalone: true,
  imports: [FormsModule, RouterLink, Button, SelectField, StatusBadge, DecimalPipe],
  templateUrl: './contracts-list-page.html',
  styleUrl: './contracts-list-page.scss',
})
export class ContractsListPage {
  private readonly contractService = inject(ContractService);

  protected readonly contracts = signal<Contract[]>([]);
  protected readonly errorMessage = signal('');
  protected readonly statusOptions = STATUS_FILTER_OPTIONS;
  protected statusFilter = '';

  constructor() {
    this.load();
  }

  protected load(): void {
    this.contractService.list((this.statusFilter || undefined) as LeaseStatus | undefined).subscribe({
      next: (contracts) => this.contracts.set(contracts),
      error: () => this.errorMessage.set('No se pudo cargar la lista de contratos.'),
    });
  }
}
