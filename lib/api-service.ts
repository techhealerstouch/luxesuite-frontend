import { apiClient } from "./api-interceptor"
import { User } from "@/types/api/user";
import { Permission, PermissionApi } from "@/types/api/permission";
import { 
  Subscription, 
  SubscriptionsApiResponse, 
  SubscriptionPlan, 
  CustomPlanUserLimit, 
  NewSubscription 
} from "@/types/api/subscription";
import { AccountSettings } from "@/types/settings/account-settings";

import { AuthenticatorFormData } from "@/types/forms/authenticator";

interface TimezoneOption {
  value: string;
  label: string;
}
class ApiService {

  //Authenticator
  async submitAuthenticatorApplication(data: AuthenticatorFormData) {
    const formData = new FormData();

    // Append normal text fields
    formData.append("name", data.name ?? "");
    formData.append("email", data.email ?? "");
    formData.append("password", data.password ?? "");
    formData.append("password_confirmation", data.confirmPassword ?? "");
    formData.append("yearsOfExperience", data.yearsOfExperience ?? "");
    formData.append("certificationDetails", data.certificationDetails ?? "");
    formData.append("currentEmployer", data.currentEmployer ?? "");
    formData.append("previousExperience", data.previousExperience ?? "");
    formData.append("professionalReferences", data.professionalReferences ?? "");
    formData.append("workingLocation", data.workingLocation ?? "");
    formData.append("availability", data.availability ?? "");
    formData.append("agreedToTerms", data.agreedToTerms ? "1" : "0");
    formData.append("useMyDetails", data.useMyDetails ? "1" : "0");

    // Append array fields
    data.specializations?.forEach((spec) =>
      formData.append("specializations[]", spec)
    );
    data.preferredBrands?.forEach((brand) =>
      formData.append("preferredBrands[]", brand)
    );

    // Append files safely
    if (data.uploadedFiles) {
      Object.keys(data.uploadedFiles).forEach((key) => {
        const file = data.uploadedFiles[key];

        // Only append if it is a valid File object
        if (file instanceof File) {
          console.log(`Appending file for ${key}:`, file.name, file.type, file.size);
          formData.append(key, file, file.name);
        } else {
          console.warn(`Skipped ${key}: not a valid File object`, file);
        }
      });
    }

    // Debug all FormData entries before sending
    console.log("Final FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Axios will automatically set Content-Type to multipart/form-data
    const response = await apiClient.post(
      "/api/user/authenticator/apply",
      formData
    );

    return response.data;
  }

  async  getAuthenticatedProducts(userId: string, page = 1, search = "") {
    if (!userId) return { data: [], meta: { current_page: 1, last_page: 1 } };

    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (search) query.append("search", search);

      const res = await apiClient.get(`/api/auth-products/${userId}?${query.toString()}`);

      return {
        data: res.data ?? [],
        meta: res.meta ?? { current_page: 1, last_page: 1 },
      };
    } catch (err: any) {
      console.error("Error fetching products:", err);
      return { data: [], meta: { current_page: 1, last_page: 1 } };
    }
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

async getTimezones(): Promise<TimezoneOption[]> {
  const res = await apiClient.get(`/api/user/timezones`);
  console.log('FULL RESPONSE', res); // res is already the array
  return Array.isArray(res) ? res : [];
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

  async addNewPaymentMethod(subscriptionId: string): Promise<{ url: string }> {
    const response = await apiClient.get(`/api/add-payment-method/${subscriptionId}`);
    return response.data; // should return { url: string }
  }

  async cancelSubscription(id: string): Promise<any> {
    return apiClient.post(`/api/subscription/${id}/cancel`);
  }

  async forceAttempt(planId: string, cycleId: string): Promise<any> {
    try {
      const response = await apiClient.post(
        `/api/subscription/${planId}/cycle/${cycleId}/force-attempt`
      );
      return response.data;
    } catch (error) {
      console.error("Error forcing subscription attempt:", error);
      throw error;
    }
  }

    async retryRefund(cycleId: string): Promise<any> {
      try {
        const response = await apiClient.post(
          `/api/subscription/cycle/${cycleId}/retry-refund`
        );
        return response.data;
      } catch (error) {
        console.error("Error forcing subscription attempt:", error);
        throw error;
      }
    }

    // Authenticator top-up
async topUpCredits(data: {
  user_id?: number; // optional if backend auto-detects
  added_by?: number; // optional if backend auto-detects
  credit_id: number;
  source?: string;
  quantity: number;
  shipping: {
    full_name: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
    email: string;
    phone: string;
  };
}) {
  return apiClient.post("/api/authenticator/top-up", data);
}


    async getAllCredits() {
      return apiClient.get("/api/credits");
    }
    //orders
async getOrders(page: number = 1, search: string = "") {
  const query = new URLSearchParams();
  query.append("page", page.toString());
  if (search) query.append("search", search);

  return apiClient.get(`/api/orders?${query.toString()}`);
}


    async updateDeliverShipment(id: number) {
      return apiClient.post(`/api/orders/shipment/${id}/deliver`);
    }

  //NFC
async refCodeNfcCheckValidity(data: { ref_code: string }) {
  return apiClient.get(`/api/nfc/check-ref-code/${data.ref_code}`);
}

async patchNfcLink(data: { ref_code: string; authenticated_product_id: number }) {
  return apiClient.put(
    `/api/nfc/${data.ref_code}/link/${data.authenticated_product_id}`
  );
}



  async createSubscription(data: {
    plan_id: string;
    service: string;
    start_date: string;
    end_date: string;
    duration: number;
    trial: any;
  }): Promise<NewSubscription> {
    return apiClient.post("/api/subscriptions", data);
  }
  
  async createTrialSubscription(): Promise<any> {
    return apiClient.post("/api/subscription/trial");
  }

  async updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription> {
    return apiClient.put(`/api/subscriptions/${id}`, data)
  }

async getBillingHistory(planId: string) {
  try {
    const res = await apiClient.get(`/api/billing-history/${planId}`);
    console.log("Full response:", res);

    // The invoices array is inside res.data
    const invoices = Array.isArray(res.data) ? res.data : [];
    console.log("Extracted invoices:", invoices);

    return invoices;
  } catch (err) {
    console.error(err);
    return [];
  }
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
