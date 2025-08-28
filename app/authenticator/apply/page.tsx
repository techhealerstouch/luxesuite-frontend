"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FormData, FormErrors, DocumentType } from "@/types/authenticator";

import { Step1UserDetails } from "@/components/Steps/Step1UserDetails";
import { Step2DocumentUpload } from "@/components/Steps/Step2DocumentUpload";
import { Step3Experience } from "@/components/Steps/Step3Experience";
import { Step6Review as Step4Review } from "@/components/Steps/Step6Review"; // renamed to step4
import {
  CheckCircle,
  XCircle,
  Upload,
  User,
  Award,
  CheckCheck,
} from "lucide-react";
import { apiService } from "@/lib/api-service";

const steps = [
  { number: 1, title: "User Details", icon: User },
  { number: 2, title: "Document Upload", icon: Upload },
  { number: 3, title: "Exp. & Qualifications", icon: Award },
  { number: 4, title: "Review & Submit", icon: CheckCheck },
];

export default function AuthenticatorApplyPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [useMyDetails, setUseMyDetails] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    uploadedFiles: {},
    yearsOfExperience: "",
    specializations: [],
    certificationDetails: "",
    currentEmployer: "",
    previousExperience: "",
    professionalReferences: "",
    workingLocation: "",
    availability: "",
    preferredBrands: [],
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const documentTypes: DocumentType[] = [
    { key: "governmentId", label: "Valid Government-Issued ID" },
    { key: "certification", label: "Proof of Certification / Training" },
    { key: "businessReg", label: "Business Registration Documents" },
    { key: "companyId", label: "Company or Employee ID" },
    {
      key: "professionalId",
      label: "Professional Affiliation or Membership ID",
    },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

const handleFileUpload = (
  docKey: string,
  e?: React.ChangeEvent<HTMLInputElement>
) => {
  if (!e) {
    // Remove file
    handleInputChange("uploadedFiles", {
      ...formData.uploadedFiles,
      [docKey]: undefined,
    });
    return;
  }

  const file = e.target.files?.[0];
  if (file) {
    handleInputChange("uploadedFiles", {
      ...formData.uploadedFiles,
      [docKey]: file,
    });
  }
};


  const validateStep = (step: number) => {
    const newErrors: any = {};

    switch (step) {
      case 1:
        if (!useMyDetails) {
          // skip validation if checkbox is checked
          if (!formData.name.trim()) newErrors.name = "Name is required";
          if (!formData.email.trim()) newErrors.email = "Email is required";
          if (!formData.email.includes("@"))
            newErrors.email = "Valid email is required";
          if (!formData.password) newErrors.password = "Password is required";
          if (formData.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";
          if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
        }
        break;

      case 3:
        if (!formData.yearsOfExperience)
          newErrors.yearsOfExperience = "Years of experience is required";
        if (formData.specializations.length === 0)
          newErrors.specializations = "At least one specialization is required";
        break;

      case 4:
        if (!formData.agreedToTerms)
          newErrors.agreedToTerms =
            "You must agree to the terms and conditions";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(4)) {
      try {
        setIsSubmitting(true);
        const response = await apiService.submitAuthenticatorApplication({
          ...formData,
          useMyDetails,
        });

        // If using Axios, the actual data is in response.data
        const message =
          response?.data?.message || "Application submitted successfully!";
        setSubmitMessage(message);
        setIsSubmitted(true);
      } catch (error: any) {
        let message = "Submission failed. Please try again.";

        if (error?.response?.data?.message) {
          message = error.response.data.message;
        } else if (error?.message) {
          message = error.message;
        }

        setSubmitMessage(message);
        setErrors({ submit: message });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

if (isSubmitted || submitMessage) {
  const isError = !isSubmitted; // if not submitted successfully, treat as error
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div
                className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  isError ? "bg-red-100" : "bg-green-100"
                }`}
              >
                {isError ? (
                  <XCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
              <CardTitle>
                {isSubmitted ? "Application Submitted!" : "Submission Status"}
              </CardTitle>
              <CardDescription>{submitMessage}</CardDescription>

              {/* Go Back Button if there is an error */}
              {isError && (
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsSubmitted(false);
                      setSubmitMessage(null);
                    }}
                  >
                    Go Back & Edit
                  </Button>
                </div>
              )}
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}


  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Become a Watch Authenticator</CardTitle>
              <CardDescription>
                Complete all steps to apply for authenticator status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Progress Steps */}
              <div className="overflow-x-auto py-4">
                <div className="flex flex-nowrap md:flex-wrap items-center justify-start gap-4 min-w-max">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.number;
                    const isCompleted = currentStep > step.number;

                    return (
                      <div
                        key={step.number}
                        className="flex items-center flex-shrink-0"
                      >
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                            isCompleted
                              ? "bg-green-100 border-green-500"
                              : isActive
                              ? "bg-blue-100 border-blue-500"
                              : "bg-gray-100 border-gray-300"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Icon
                              className={`w-5 h-5 ${
                                isActive ? "text-blue-600" : "text-gray-400"
                              }`}
                            />
                          )}
                        </div>
                        <div className="ml-2">
                          <div
                            className={`text-sm font-medium ${
                              isActive
                                ? "text-blue-600"
                                : isCompleted
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            Step {step.number}
                          </div>
                          <div className="text-xs text-gray-500">
                            {step.title}
                          </div>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`mx-2 h-0.5 w-12 ${
                              isCompleted ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step Content Card */}
              <div className="mt-6">
                <Card className="overflow-hidden">
                  <CardContent className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
                    {currentStep === 1 && (
                      <Step1UserDetails
                        formData={formData}
                        handleInputChange={handleInputChange}
                        errors={errors}
                        useMyDetails={useMyDetails}
                        setUseMyDetails={setUseMyDetails}
                      />
                    )}
                    {currentStep === 2 && (
                      <Step2DocumentUpload
                        formData={formData}
                        handleFileUpload={handleFileUpload}
                        documentTypes={documentTypes}
                      />
                    )}
                    {currentStep === 3 && (
                      <Step3Experience
                        formData={formData}
                        handleInputChange={handleInputChange}
                        toggleSpecialization={(spec: string) => {
                          setFormData((prev) => ({
                            ...prev,
                            specializations: prev.specializations.includes(spec)
                              ? prev.specializations.filter((s) => s !== spec)
                              : [...prev.specializations, spec],
                          }));
                        }}
                        togglePreferredBrand={(brand: string) => {
                          setFormData((prev) => ({
                            ...prev,
                            preferredBrands: prev.preferredBrands.includes(
                              brand
                            )
                              ? prev.preferredBrands.filter((b) => b !== brand)
                              : [...prev.preferredBrands, brand],
                          }));
                        }}
                        errors={errors}
                      />
                    )}
                    {currentStep === 4 && (
                      <Step4Review
                        formData={formData}
                        handleInputChange={handleInputChange}
                        errors={errors}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                {currentStep < 4 ? (
                  <Button onClick={nextStep}>Next</Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
