export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  timezone: string;
  account: {
    id: number;
    name: string;
    slug: string;
  };
}