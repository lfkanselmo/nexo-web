import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeaseStatus } from '../../../core/models/lease-status';
import { Button } from '../../../shared/components/button/button';
import { SelectField, SelectOption } from '../../../shared/components/select-field/select-field';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { TextField } from '../../../shared/components/text-field/text-field';

@Component({
  selector: 'nexo-design-system-page',
  standalone: true,
  imports: [FormsModule, Button, TextField, SelectField, StatusBadge],
  templateUrl: './design-system-page.html',
  styleUrl: './design-system-page.scss',
})
export class DesignSystemPage {
  protected readonly propertyTypes: SelectOption[] = [
    { value: 'apartment', label: 'Apartamento' },
    { value: 'house', label: 'Casa' },
    { value: 'office', label: 'Oficina' },
  ];

  protected readonly allStatuses: LeaseStatus[] = ['DRAFT', 'ACTIVE', 'OVERDUE', 'RENEWAL', 'TERMINATED'];

  protected tenantName = '';
  protected propertyType = '';
}
