import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData, FormErrors } from "@/types/authenticator";

interface StepProps {
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  errors: FormErrors;
  useMyDetails: boolean;
  setUseMyDetails: (value: boolean) => void;
}

export const Step1UserDetails: FC<StepProps> = ({
  formData,
  handleInputChange,
  errors,
  useMyDetails,
  setUseMyDetails,
}) => {
  const fields = [
    { id: "name", label: "Full Name *", type: "text" },
    { id: "email", label: "Email Address *", type: "email" },
    { id: "password", label: "Password *", type: "password" },
    { id: "confirmPassword", label: "Confirm Password *", type: "password" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          id="useMyDetails"
          type="checkbox"
          checked={useMyDetails}
          onChange={(e) => setUseMyDetails(e.target.checked)}
          className="w-4 h-4"
        />
        <Label htmlFor="useMyDetails">
          Use your details to apply for authenticator
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({ id, label, type }) => (
          <div key={id}>
            <Label htmlFor={id}>{label}</Label>
            <Input
              id={id}
              type={type}
              value={formData[id as keyof FormData] as string}
              onChange={(e) => handleInputChange(id, e.target.value)}
              placeholder={label}
              className={errors[id] ? "border-red-500" : ""}
              disabled={useMyDetails} // disable if checkbox is checked
            />
            {errors[id] && !useMyDetails && (
              <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
