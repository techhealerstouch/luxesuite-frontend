// types.ts
export interface FormData {
  // Step 1
  name: string;
  email: string;
  password: string;
  confirmPassword: string;

  // Step 2
  uploadedFiles: Record<string, File>;

  // Step 3
  yearsOfExperience: string;
  specializations: string[];
  certificationDetails: string;

  // Step 4
  currentEmployer: string;
  previousExperience: string;
  professionalReferences: string;

  // Step 5
  workingLocation: string;
  availability: string;
  preferredBrands: string[];

  // Step 6
  agreedToTerms: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

export interface DocumentType {
  key: string;
  label: string;
  required?: boolean;
}
