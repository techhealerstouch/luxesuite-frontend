import { apiClient } from "./api-interceptor"

// Types for API responses
export interface User {
  id: number;
  name: string;
  email: string;
  account: {
    name: string;
    slug: string;
  }
}

export interface Permission {
  name: string;
  label: string;
  category: string;
}

export interface PermissionApi {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: any;
}

interface PermissionApiResponse {
  message: string;
  data: PermissionApi[];
}

export interface Subscription {
  id: number
  account_id: number
  plan_id: number
  service: string
  status: "active" | "pending" | "suspended" | "cancelled"
  start_date: string
  end_date: string
  cancelled_at: string | null
  created_at: string | null
  updated_at: string | null
  plan: {
    id: number
    name: "Starter" | "Professional" | "Enterprise" // adjust based on your actual plan names
    slug: "starter" | "professional" | "enterprise"
    price: string
    domain: string
    sub_user_limit: number
    product_limit: number
    created_at: string | null
    updated_at: string | null
  }
}

export interface SubscriptionsApiResponse {
  message: string
  data: Subscription[]
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  features: string[]
  isActive: boolean
    sub_user_limit: number
  product_limit: number
}

export interface CustomPlanUserLimit {
  id: string
  type: string
  count: number
  price: number
}

export interface NewSubscription {
  payment_url: string;
}

export interface AccountSettings {
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  privacy: {
    profileVisible: boolean
    analyticsEnabled: boolean
  }
  billing: {
    autoRenew: boolean
    invoiceEmail: string
  }
}

export interface AuthenticatorFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  uploadedFiles: Record<string, File>;
  yearsOfExperience: string;
  specializations: string[];
  certificationDetails: string;
  currentEmployer: string;
  previousExperience: string;
  professionalReferences: string;
  workingLocation: string;
  availability: string;
  preferredBrands: string[];
  agreedToTerms: boolean;
  useMyDetails?: boolean;
}

class ApiService {

  //Authenticator
async submitAuthenticatorApplication(data: AuthenticatorFormData) {
    const formData = new FormData();

    // Append normal text fields
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.confirmPassword);
    formData.append("yearsOfExperience", data.yearsOfExperience);
    formData.append("certificationDetails", data.certificationDetails);
    formData.append("currentEmployer", data.currentEmployer);
    formData.append("previousExperience", data.previousExperience);
    formData.append("professionalReferences", data.professionalReferences);
    formData.append("workingLocation", data.workingLocation);
    formData.append("availability", data.availability);
    formData.append("agreedToTerms", data.agreedToTerms ? "1" : "0");
    formData.append("useMyDetails", data.useMyDetails ? "1" : "0");

    // Append array fields
    data.specializations.forEach((spec) =>
      formData.append("specializations[]", spec)
    );
    data.preferredBrands.forEach((brand) =>
      formData.append("preferredBrands[]", brand)
    );

    // Append files

console.log("FormData contents:");
for (let [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}
    for (const key in data.uploadedFiles) {
      formData.append(key, data.uploadedFiles[key]);
    }

    // Axios will auto-set Content-Type with boundary
    const response = await apiClient.post(
      "/api/user/authenticator/apply",
      formData
    );

    return response.data;
  }

  // Account endpoints
  async getAccount(): Promise<User> {
    return apiClient.get("/api/user")
  }

  async updateAccount(data: {
    name: string;
    email: string;
    account: {
      name: string;
    };
  }): Promise<User> {
    return apiClient.put("/api/user", data);
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    return apiClient.put("/api/user/change-password", data)
  }

  // Subscription endpoints
  async getSubscriptions(): Promise<SubscriptionsApiResponse> {
    return apiClient.get("/api/subscriptions")
  }

  async getSubscription(id: string): Promise<Subscription> {
    return apiClient.get(`/subscriptions/${id}`)
  }

  async createSubscription(data: {
    plan_id: string;
    service: string;
    start_date: string;
    end_date: string;
    duration: number;
  }): Promise<NewSubscription> {
    return apiClient.post("/api/subscriptions", data);
  }

  async updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription> {
    return apiClient.put(`/api/subscriptions/${id}`, data)
  }

  async cancelSubscription(id: string): Promise<void> {
    return apiClient.delete(`/api/subscriptions/${id}`)
  }

// USERS
async getAllUsers(): Promise<{ message: string; data: User[] }> {
  return apiClient.get("/api/users");
}

async createUserWithPermissions(data: {
  name: string;
  email: string;
  password: string;
  permissions: string[];
}): Promise<User> {
  const response = await apiClient.post("/api/users", data);
  return response.data.data; // created user is inside response.data.data
}

async getUserById(id: string): Promise<User> {
  const response = await apiClient.get(`/api/users/${id}`);
  return response.data; // <-- may be undefined
}


async getUserPermissions(id: string): Promise<PermissionApi[]> {
  const response = await apiClient.get(`/api/users/${id}/permissions`);
  return response.data || []; // <- this is the actual array
}


async updateUserWithPermissions(
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    permissions: string[];
  }
): Promise<User> {
  const response = await apiClient.put(`/api/users/${id}`, data);
  return response.data.data; // updated user is inside response.data.data
}

// Role and Permissions
async getAllPermissions(): Promise<Permission[]> {
  return apiClient.get("/api/permissions");
}

  // Subscription plans
  async upgradeSubscription(subscriptionId: string, planId: string, duration: number): Promise<Subscription> {
    return apiClient.put(`/api/subscriptions/${subscriptionId}/upgrade`, {
      plan_id: planId,
      duration,
    });
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return apiClient.get("/api/subscription-plans")
  }

  async getSelectedPlan(): Promise<SubscriptionPlan> {
    return apiClient.get(`/api/subscriptions/${id}`)
  }

    async getCustomUserLimit(): Promise<CustomPlanUserLimit[]> {
    return apiClient.get(`/api/plan/custom-limit`)
  }

  async createCustomSubscription(data: {
    plan_id: number;
    service: string;
    duration: number;
    user_limit_id: number;
  }): Promise<any> {
    return apiClient.post(`/api/subscriptions/custom`, data);
  }

  async changePlan(planId: string): Promise<void> {
    return apiClient.post("/api/subscription-plans/change", { planId })
  }

  // Settings
  async getSettings(): Promise<AccountSettings> {
    return apiClient.get("/api/account/settings")
  }

  async updateSettings(data: Partial<AccountSettings>): Promise<AccountSettings> {
    return apiClient.put("/api/account/settings", data)
  }

  // Analytics
  async getAnalytics(subscriptionId: string, period: "7d" | "30d" | "90d" = "30d") {
    return apiClient.get(`/api/subscriptions/${subscriptionId}/analytics?period=${period}`)
  }
}

export const apiService = new ApiService()
