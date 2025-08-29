export interface Subscription {
  id: number;
  account_id: number;
  plan_id: number;
  service: string;
  payment_url: string;
  status: "active" | "pending" | "suspended" | "cancelled";
  start_date: string;
  end_date: string;
  cancelled_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  plan: {
    id: number;
    name: "Starter" | "Professional" | "Enterprise"; // adjust if needed
    slug: "starter" | "professional" | "enterprise";
    price: string;
    domain: string;
    sub_user_limit: number;
    product_limit: number;
    created_at: string | null;
    updated_at: string | null;
  };
}

export interface SubscriptionsApiResponse {
  message: string;
  data: Subscription[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  isActive: boolean;
  sub_user_limit: number;
  product_limit: number;
}

export interface CustomPlanUserLimit {
  id: string;
  type: string;
  count: number;
  price: number;
}

export interface NewSubscription {
  payment_url: string;
}