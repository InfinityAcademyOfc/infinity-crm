
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  category: string;
  client: string | null;
  status: string;
  notes: string | null;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  reference_id?: string;
}
