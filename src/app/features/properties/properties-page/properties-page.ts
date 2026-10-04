import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../../core/services/property.service';
import { Property } from '../../../core/models/property';
import { Button } from '../../../shared/components/button/button';
import { TextField } from '../../../shared/components/text-field/text-field';

@Component({
  selector: 'nexo-properties-page',
  standalone: true,
  imports: [FormsModule, Button, TextField],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.scss',
})
export class PropertiesPage {
  private readonly propertyService = inject(PropertyService);

  protected readonly properties = signal<Property[]>([]);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal('');

  protected address = '';
  protected city = '';

  constructor() {
    this.loadProperties();
  }

  private loadProperties(): void {
    this.propertyService.list().subscribe({
      next: (properties) => this.properties.set(properties),
      error: () => this.errorMessage.set('No se pudo cargar la lista de propiedades.'),
    });
  }

  protected submit(): void {
    if (!this.address.trim() || !this.city.trim()) {
      return;
    }
    this.saving.set(true);
    this.errorMessage.set('');
    this.propertyService.create({ address: this.address, city: this.city }).subscribe({
      next: (property) => {
        this.properties.update((current) => [...current, property]);
        this.address = '';
        this.city = '';
        this.saving.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo crear la propiedad.');
        this.saving.set(false);
      },
    });
  }
}
