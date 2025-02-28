export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  categoryId: string;
  category?: ExpenseCategory;
  date: string;
  paymentMethod?: string;
  receiptUrl?: string;
  receiptType?: 'image' | 'pdf';
  createdAt: string;
  updatedAt: string;
}

export type ExpensePeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface ExpenseFilterOptions {
  period: ExpensePeriod;
  startDate?: string;
  endDate?: string;
  categoryIds?: string[];
  minAmount?: number;
  maxAmount?: number;
}

export interface CategoryTotal {
  categoryId: string;
  categoryName: string;
  total: number;
  count: number;
} 