import { FC } from "react";
import { FormData, FormErrors } from "@/types/authenticator";

interface StepProps {
  formData: FormData;
  handleInputChange: (field: string, value: boolean) => void;
  errors: FormErrors;
}

export const Step6Review: FC<StepProps> = ({ formData, handleInputChange, errors }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-700">Personal Information</h4>
          <p className="text-sm">Name: {formData.name}</p>
          <p className="text-sm">Email: {formData.email}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700">Documents Uploaded</h4>
          <p className="text-sm">{Object.keys(formData.uploadedFiles).length} document(s) uploaded</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700">Experience</h4>
          <p className="text-sm">Years: {formData.yearsOfExperience}</p>
          <p className="text-sm">Specializations: {formData.specializations.join(', ')}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700">Location & Availability</h4>
          <p className="text-sm">Location: {formData.workingLocation}</p>
          <p className="text-sm">Availability: {formData.availability}</p>
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="agreedToTerms"
          checked={formData.agreedToTerms}
          onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="agreedToTerms" className="text-sm">
          I agree to the terms and conditions and confirm all information is accurate. *
        </label>
      </div>
      {errors.agreedToTerms && <p className="text-red-500 text-sm">{errors.agreedToTerms}</p>}
    </div>
  );
};
