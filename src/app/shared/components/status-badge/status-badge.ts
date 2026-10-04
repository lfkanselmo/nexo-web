import { Component, computed, input } from '@angular/core';
import { LEASE_STATUS_LABELS, LeaseStatus } from '../../../core/models/lease-status';

const STATUS_MODIFIER: Record<LeaseStatus, string> = {
  DRAFT: 'warning',
  ACTIVE: 'success',
  OVERDUE: 'danger',
  RENEWAL: 'info',
  TERMINATED: 'neutral',
};

@Component({
  selector: 'nexo-status-badge',
  standalone: true,
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
})
export class StatusBadge {
  status = input.required<LeaseStatus>();

  protected label = computed(() => LEASE_STATUS_LABELS[this.status()]);
  protected modifier = computed(() => STATUS_MODIFIER[this.status()]);
}
