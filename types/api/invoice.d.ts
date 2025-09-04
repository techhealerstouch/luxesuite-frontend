export interface Invoice {
  id: string;
  plan_id: string;
  date: string;
  amount: string;
  status: string;
  payment_link?: string | null;
}
