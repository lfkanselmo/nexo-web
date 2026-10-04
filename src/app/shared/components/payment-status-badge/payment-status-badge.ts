import { Component, computed, input } from '@angular/core';
import { PaymentStatus } from '../../../core/models/payment';

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  LATE: 'Atrasado',
};

const PAYMENT_STATUS_MODIFIER: Record<PaymentStatus, string> = {
  PENDING: 'warning',
  PAID: 'success',
  LATE: 'danger',
};

@Component({
  selector: 'nexo-payment-status-badge',
  standalone: true,
  templateUrl: './payment-status-badge.html',
})
export class PaymentStatusBadge {
  status = input.required<PaymentStatus>();

  protected label = computed(() => PAYMENT_STATUS_LABELS[this.status()]);
  protected modifier = computed(() => PAYMENT_STATUS_MODIFIER[this.status()]);
}
