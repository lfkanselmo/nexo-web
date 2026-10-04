export type LeaseStatus = 'DRAFT' | 'ACTIVE' | 'OVERDUE' | 'TERMINATED' | 'RENEWAL';

export const LEASE_STATUS_LABELS: Record<LeaseStatus, string> = {
  DRAFT: 'Borrador',
  ACTIVE: 'Activo',
  OVERDUE: 'En mora',
  TERMINATED: 'Terminado',
  RENEWAL: 'En renovación',
};
