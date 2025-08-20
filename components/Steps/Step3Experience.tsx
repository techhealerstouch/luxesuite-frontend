import { FC } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormData, FormErrors } from "@/types/authenticator";
import { Input } from "@/components/ui/input";

interface StepProps {
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  toggleSpecialization: (spec: string) => void;
  togglePreferredBrand: (brand: string) => void;
  errors: FormErrors;
}

export const Step3Experience: FC<StepProps> = ({
  formData,
  handleInputChange,
  toggleSpecialization,
  togglePreferredBrand,
  errors,
}) => {
  const specializations = ['Vintage Watches', 'Luxury Watches', 'Sports Watches', 'Dress Watches', 'Complications', 'Movement Analysis'];
  const watchBrands = [
    "Rolex", "Omega", "Patek Philippe", "Audemars Piguet", "Cartier", 
    "Tudor", "TAG Heuer", "Breitling", "IWC", "Panerai", "Other"
  ];

  return (
    <div className="space-y-4">
      {/* Experience Card */}
<Card>
  <CardHeader>
    <CardTitle>Years of Experience</CardTitle>
    <CardDescription>
      Select your experience level in watchmaking/authentication
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Years of Experience */}
    <div>
      <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
      <select
        id="yearsOfExperience"
        value={formData.yearsOfExperience}
        onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
        className={`w-full p-2 border rounded-md ${
          errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Select experience level</option>
        <option value="0-1">0-1 years</option>
        <option value="2-5">2-5 years</option>
        <option value="6-10">6-10 years</option>
        <option value="11-15">11-15 years</option>
        <option value="15+">15+ years</option>
      </select>
      {errors.yearsOfExperience && (
        <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience}</p>
      )}
    </div>

    {/* Specializations */}
    <div>
      <Label>Specializations</Label>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {specializations.map((spec) => (
          <label key={spec} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.specializations.includes(spec)}
              onChange={() => toggleSpecialization(spec)}
              className="rounded"
            />
            <span className="text-sm">{spec}</span>
          </label>
        ))}
      </div>
      {errors.specializations && (
        <p className="text-red-500 text-sm mt-1">{errors.specializations}</p>
      )}
    </div>

    {/* Certification Details */}
    <div>
      <Label htmlFor="certificationDetails">Certifications & Training</Label>
      <textarea
        id="certificationDetails"
        value={formData.certificationDetails}
        onChange={(e) => handleInputChange('certificationDetails', e.target.value)}
        placeholder="Describe your certifications, training, or formal education in watchmaking/authentication"
        className="w-full p-2 border rounded-md h-24 border-gray-300"
      />
    </div>
  </CardContent>
</Card>


      {/* Working Location & Availability Card */}
      <Card>
        <CardHeader>
          <CardTitle>Work Details</CardTitle>
          <CardDescription>Provide your working location and availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="workingLocation">Working Location *</Label>
            <Input
              id="workingLocation"
              value={formData.workingLocation}
              onChange={(e) => handleInputChange('workingLocation', e.target.value)}
              placeholder="City, State/Province, Country"
            />
          </div>

          <div className="mb-4">
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
        </CardContent>
      </Card>

      {/* Employment & References Card */}
      <Card>
        <CardHeader>
          <CardTitle>Employment & References</CardTitle>
          <CardDescription>Provide your current employment, previous experience, and professional references</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
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

          <div className="mb-4">
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
        </CardContent>
      </Card>
    </div>
  );
};
