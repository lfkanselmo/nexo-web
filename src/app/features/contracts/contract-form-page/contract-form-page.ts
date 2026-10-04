import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContractService } from '../../../core/services/contract.service';
import { PropertyService } from '../../../core/services/property.service';
import { TenantService } from '../../../core/services/tenant.service';
import { InterestType } from '../../../core/models/interest-type';
import { Button } from '../../../shared/components/button/button';
import { SelectField, SelectOption } from '../../../shared/components/select-field/select-field';
import { TextField } from '../../../shared/components/text-field/text-field';

const INTEREST_TYPE_OPTIONS: SelectOption[] = [
  { value: 'FIXED', label: 'Fijo (interés simple)' },
  { value: 'VARIABLE', label: 'Variable (interés compuesto)' },
];

@Component({
  selector: 'nexo-contract-form-page',
  standalone: true,
  imports: [FormsModule, Button, SelectField, TextField],
  templateUrl: './contract-form-page.html',
  styleUrl: './contract-form-page.scss',
})
export class ContractFormPage {
  private readonly contractService = inject(ContractService);
  private readonly propertyService = inject(PropertyService);
  private readonly tenantService = inject(TenantService);
  private readonly router = inject(Router);

  protected readonly propertyOptions = signal<SelectOption[]>([]);
  protected readonly tenantOptions = signal<SelectOption[]>([]);
  protected readonly interestTypeOptions = INTEREST_TYPE_OPTIONS;
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal('');

  protected propertyId = '';
  protected tenantId = '';
  protected startDate = '';
  protected endDate = '';
  protected monthlyRent = '';
  protected dailyInterestRate = '';
  protected interestType: InterestType | '' = '';

  constructor() {
    this.propertyService.list().subscribe((properties) => {
      this.propertyOptions.set(properties.map((property) => ({ value: property.id, label: `${property.address}, ${property.city}` })));
    });
    this.tenantService.list().subscribe((tenants) => {
      this.tenantOptions.set(tenants.map((tenant) => ({ value: tenant.id, label: tenant.fullName })));
    });
  }

  protected submit(): void {
    if (
      !this.propertyId ||
      !this.tenantId ||
      !this.startDate ||
      !this.endDate ||
      !this.monthlyRent ||
      !this.dailyInterestRate ||
      !this.interestType
    ) {
      this.errorMessage.set('Completá todos los campos.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.contractService
      .create({
        propertyId: this.propertyId,
        tenantId: this.tenantId,
        startDate: this.startDate,
        endDate: this.endDate,
        monthlyRent: Number(this.monthlyRent),
        dailyInterestRate: Number(this.dailyInterestRate),
        interestType: this.interestType,
      })
      .subscribe({
        next: (contract) => this.router.navigate(['/contracts', contract.id]),
        error: () => {
          this.errorMessage.set('No se pudo crear el contrato.');
          this.saving.set(false);
        },
      });
  }
}
