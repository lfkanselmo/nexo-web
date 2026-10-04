import { InterestType } from './interest-type';
import { LeaseStatus } from './lease-status';

export interface Contract {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  dailyInterestRate: number;
  interestType: InterestType;
  status: LeaseStatus;
}

export interface ContractRequest {
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  dailyInterestRate: number;
  interestType: InterestType;
}
