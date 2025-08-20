import { FC } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormData, FormErrors } from "@/types/authenticator";

interface StepProps {
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  errors: FormErrors;
}

export const Step4Professional: FC<StepProps> = ({ formData, handleInputChange, errors }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="currentEmployer">Current Employment Status *</Label>
        <Input
          id="currentEmployer"
          value={formData.currentEmployer}
          onChange={(e) => handleInputChange('currentEmployer', e.target.value)}
          placeholder="e.g., Watch dealer, Horologist, Independent authenticator"
          className={errors.currentEmployer ? 'border-red-500' : ''}
        />
        {errors.currentEmployer && <p className="text-red-500 text-sm mt-1">{errors.currentEmployer}</p>}
      </div>

      <div>
        <Label htmlFor="previousExperience">Previous Relevant Experience</Label>
        <textarea
          id="previousExperience"
          value={formData.previousExperience}
          onChange={(e) => handleInputChange('previousExperience', e.target.value)}
          placeholder="Describe your previous work experience in watches, jewelry, or related fields"
          className="w-full p-2 border rounded-md h-24"
        />
      </div>

      <div>
        <Label htmlFor="professionalReferences">Professional References</Label>
        <textarea
          id="professionalReferences"
          value={formData.professionalReferences}
          onChange={(e) => handleInputChange('professionalReferences', e.target.value)}
          placeholder="Provide contact information for professional references (optional)"
          className="w-full p-2 border rounded-md h-24"
        />
      </div>
    </div>
  );
};
