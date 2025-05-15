
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
  notes: string;
}
