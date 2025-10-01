export interface Shipment {
  id: number;
  credit_invoice_id: number;
  shipment_number: string;
  tracking_number: string;
  courier: string;
  full_name: string;
  phone_number: string;
  street: string;
  barangay: string | null;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  status: string;
  shipment_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AddedBy {
  id: number;
  name: string;
}

export interface Order {
  id: number;
  invoice_number: string;
  shipping_cost: string;
  discount: string;
  credit_name: string;
  credits_id: number;
  user_id: number;
  payment_url: string | null;
  amount: string;
  external_id: string;
  quantity: number;
  status: string;
  created_at: string;
  updated_at: string;
  shipment?: Shipment;
  user?: User;
  added_by?: AddedBy;
}
