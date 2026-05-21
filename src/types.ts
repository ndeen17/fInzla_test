export type LimitStatus = 'On Track' | 'Warning' | 'Exceeded';

export interface CategoryLimit {
  id: string;
  name: string;
  limitAmount: number;
  period: 'monthly';
  createdAt: string;
}

export interface Activity {
  id: string;
  categoryId: string;
  amount: number;
  description: string;
  occurredAt: string;
}

export interface LimitSummary {
  categoryId: string;
  name: string;
  limitAmount: number;
  period: 'monthly';
  usage: number;
  percentage: number;
  status: LimitStatus;
}
