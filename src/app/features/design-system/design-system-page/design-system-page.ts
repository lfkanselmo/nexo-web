import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../shared/components/button/button';
import { TextField } from '../../../shared/components/text-field/text-field';
import { SelectField, SelectOption } from '../../../shared/components/select-field/select-field';

@Component({
  selector: 'nexo-design-system-page',
  standalone: true,
  imports: [FormsModule, Button, TextField, SelectField],
  templateUrl: './design-system-page.html',
  styleUrl: './design-system-page.scss',
})
export class DesignSystemPage {
  protected readonly propertyTypes: SelectOption[] = [
    { value: 'apartment', label: 'Apartamento' },
    { value: 'house', label: 'Casa' },
    { value: 'office', label: 'Oficina' },
  ];

  protected tenantName = '';
  protected propertyType = '';
}
