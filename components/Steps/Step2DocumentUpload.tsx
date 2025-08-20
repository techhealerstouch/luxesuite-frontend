import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { FormData, DocumentType } from "@/types/authenticator";

interface StepProps {
  formData: FormData;
  handleFileUpload: (documentType: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  documentTypes: DocumentType[];
}

export const Step2DocumentUpload: FC<StepProps> = ({ formData, handleFileUpload, documentTypes }) => {
  return (
    <div className="space-y-4">
      {documentTypes.map((doc) => (
        <div key={doc.key} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Label>{doc.label}</Label>
            {formData.uploadedFiles[doc.key] && (
              <Badge variant="secondary" className="text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Uploaded
              </Badge>
            )}
          </div>
          <Input
            type="file"
            accept=".png,.jpg,.jpeg,.pdf,.docx"
            onChange={(e) => handleFileUpload(doc.key, e)}
            className="cursor-pointer"
          />
          {formData.uploadedFiles[doc.key] && (
            <p className="text-sm text-gray-600 mt-1">
              File: {formData.uploadedFiles[doc.key].name}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
