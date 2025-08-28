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