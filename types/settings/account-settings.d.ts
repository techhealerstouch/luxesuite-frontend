export interface AccountSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    profileVisible: boolean;
    analyticsEnabled: boolean;
  };
  billing: {
    autoRenew: boolean;
    invoiceEmail: string;
  };
}