import { FC } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormData, FormErrors } from "@/types/authenticator";

interface StepProps {
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  togglePreferredBrand: (brand: string) => void;
}

export const Step5Location: FC<StepProps> = ({ formData, handleInputChange, togglePreferredBrand }) => {
  const watchBrands = [
    "Rolex", "Omega", "Patek Philippe", "Audemars Piguet", "Cartier", 
    "Tudor", "TAG Heuer", "Breitling", "IWC", "Panerai", "Other"
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="workingLocation">Working Location *</Label>
        <Input
          id="workingLocation"
          value={formData.workingLocation}
          onChange={(e) => handleInputChange('workingLocation', e.target.value)}
          placeholder="City, State/Province, Country"
          className=""
        />
      </div>

      <div>
        <Label htmlFor="availability">Availability *</Label>
        <select
          id="availability"
          value={formData.availability}
          onChange={(e) => handleInputChange('availability', e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select availability</option>
          <option value="full-time">Full-time (40+ hours/week)</option>
          <option value="part-time">Part-time (20-40 hours/week)</option>
          <option value="freelance">Freelance/As needed</option>
          <option value="weekends">Weekends only</option>
        </select>
      </div>

      <div>
        <Label>Preferred Watch Brands (Select all that apply)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {watchBrands.map((brand) => (
            <label key={brand} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferredBrands.includes(brand)}
                onChange={() => togglePreferredBrand(brand)}
                className="rounded"
              />
              <span className="text-sm">{brand}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
