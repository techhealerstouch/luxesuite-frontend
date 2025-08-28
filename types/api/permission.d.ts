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

export interface PermissionApiResponse {
  message: string;
  data: PermissionApi[];
}