export interface Penalty {
  contractId: string;
  overdueDays: number;
  principalOwed: number;
  interestAmount: number;
  total: number;
}
