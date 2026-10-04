import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TenantService } from '../../../core/services/tenant.service';
import { Tenant } from '../../../core/models/tenant';
import { Button } from '../../../shared/components/button/button';
import { TextField } from '../../../shared/components/text-field/text-field';

@Component({
  selector: 'nexo-tenants-page',
  standalone: true,
  imports: [FormsModule, Button, TextField],
  templateUrl: './tenants-page.html',
  styleUrl: './tenants-page.scss',
})
export class TenantsPage {
  private readonly tenantService = inject(TenantService);

  protected readonly tenants = signal<Tenant[]>([]);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal('');

  protected fullName = '';
  protected email = '';
  protected documentId = '';

  constructor() {
    this.loadTenants();
  }

  private loadTenants(): void {
    this.tenantService.list().subscribe({
      next: (tenants) => this.tenants.set(tenants),
      error: () => this.errorMessage.set('No se pudo cargar la lista de inquilinos.'),
    });
  }

  protected submit(): void {
    if (!this.fullName.trim() || !this.email.trim() || !this.documentId.trim()) {
      return;
    }
    this.saving.set(true);
    this.errorMessage.set('');
    this.tenantService.create({ fullName: this.fullName, email: this.email, documentId: this.documentId }).subscribe({
      next: (tenant) => {
        this.tenants.update((current) => [...current, tenant]);
        this.fullName = '';
        this.email = '';
        this.documentId = '';
        this.saving.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo crear el inquilino.');
        this.saving.set(false);
      },
    });
  }
}
