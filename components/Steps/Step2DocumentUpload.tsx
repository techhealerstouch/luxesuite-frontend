import { FC } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, CheckCircle } from "lucide-react";
import { FormData, DocumentType } from "@/types/authenticator";

interface StepProps {
  formData: FormData;
  handleFileUpload: (documentType: string, event: React.ChangeEvent<HTMLInputElement> | undefined) => void;
  documentTypes: DocumentType[];
}

export const Step2DocumentUpload: FC<StepProps> = ({
  formData,
  handleFileUpload,
  documentTypes,
}) => {
  return (
    <CardContent className="space-y-4">
      {documentTypes.map((doc) => (
        <div key={doc.key} className="relative">
          {/* Label on top */}
          <label className="block mb-2 text-sm font-medium text-gray-700">{doc.label}</label>

          <div className="flex items-center justify-between rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
            {formData.uploadedFiles[doc.key] ? (
              <div className="relative flex items-center w-full">
                <span className="truncate">{formData.uploadedFiles[doc.key].name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-6 w-6 p-0 flex-shrink-0"
                  onClick={() => handleFileUpload(doc.key, undefined)} // remove file
                >
                  <X className="h-3 w-3" />
                </Button>
                <CheckCircle className="ml-2 h-4 w-4 text-green-600 flex-shrink-0" />
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center w-full h-12 text-gray-500">
                <Upload className="mr-2 h-5 w-5 text-gray-400" />
                <span>Upload File/Image</span>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf,.docx"
                  className="hidden"
                  onChange={(e) => handleFileUpload(doc.key, e)}
                />
              </label>
            )}
          </div>
        </div>
      ))}
    </CardContent>
  );
};
