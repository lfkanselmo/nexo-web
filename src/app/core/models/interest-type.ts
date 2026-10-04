export type InterestType = 'FIXED' | 'VARIABLE';

export const INTEREST_TYPE_LABELS: Record<InterestType, string> = {
  FIXED: 'Fijo',
  VARIABLE: 'Variable (compuesto)',
};
