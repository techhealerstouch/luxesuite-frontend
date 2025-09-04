import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Box,
  FileText,
  GitPullRequest,
  Cpu,
  Activity,
  X,
  Download,
} from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Badge } from "@/components/ui/badge";
import { generateAuthenticationPDF } from "@/utils/pdf-generator";

const tabIcons: Record<string, any> = {
  serial_info: Box,
  documents: FileText,
  case_analysis: GitPullRequest,
  dial_analysis: Cpu,
  bracelet_analysis: Activity,
  movement_analysis: Cpu,
  performance_test: Activity,
};

interface ProductDialogProps {
  product: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthenticatorProductDialog({
  product,
  open,
  onOpenChange,
}: ProductDialogProps) {
  if (!product) return null;
  const handleDownloadPDF = () => {
    if (product) {
      generateAuthenticationPDF(product);
    }
  };
  const sections = [
    "serial_info",
    "documents",
    "case_analysis",
    "dial_analysis",
    "bracelet_analysis",
    "movement_analysis",
    "performance_test",
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[90vh] overflow-y-auto w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
        <Dialog.Close asChild>
          <Button
            variant="ghost"
            className="absolute top-4 right-4 p-2 md:p-2"
            aria-label="Close"
          >
            <X size={20} />
          </Button>
        </Dialog.Close>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <div>
            <Dialog.Title className="text-2xl font-bold">
              {product.brand}
            </Dialog.Title>
            <Dialog.Description className="text-gray-500 mt-1">
              {product.serial_info?.model_number}
            </Dialog.Description>
          </div>
        </div>

        <Dialog.Description className="text-gray-600 mb-4">
          Final Summary: {product.final_summary}
        </Dialog.Description>

        {/* Tabs */}
        <Tabs.Root defaultValue="serial_info" className="w-full">
          <Tabs.List className="flex flex-wrap border-b border-gray-200 mb-4">
            {sections.map((sectionKey) => {
              const Icon = tabIcons[sectionKey];
              return (
                <Tabs.Trigger
                  key={sectionKey}
                  value={sectionKey}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary"
                >
                  <Icon className="w-4 h-4" /> {formatTitle(sectionKey)}
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>

          {sections.map((sectionKey) => (
            <Tabs.Content key={sectionKey} value={sectionKey} className="pb-4">
              <Section
                title={formatTitle(sectionKey)}
                data={product[sectionKey]}
              />
            </Tabs.Content>
          ))}
        </Tabs.Root>
        <div className="mb-0 flex justify-end">
          <Button
            className="flex items-center gap-2 text-white"
            variant="secondary"
            onClick={handleDownloadPDF}
          >
            <Download size={16} /> Download Certificate
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function Section({
  title,
  data,
}: {
  title: string;
  data: Record<string, any>;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Collect all image fields
  const imageFields = Object.entries(data).filter(
    ([, value]) =>
      typeof value === "string" &&
      (value.endsWith(".png") ||
        value.endsWith(".jpg") ||
        value.endsWith(".jpeg") ||
        value.endsWith(".svg"))
  );

  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">{formatTitle(title)}</h3>

      {/* Images row with labels (no white boxes) */}
      {imageFields.length > 0 && (
        <div className="flex justify-between flex-wrap gap-4 mb-4">
          {imageFields.map(([key, value]) => {
            const imageUrl = `${baseUrl}/${value}`;
            const label = formatTitle(key.replace(/_path$/i, ""));

            return (
              <div
                key={key}
                className="flex flex-col items-center w-full md:w-[calc(25%-1rem)]"
              >
                <img
                  src={imageUrl}
                  alt={key}
                  className="h-32 w-auto rounded-lg cursor-pointer border border-gray-200 object-contain mb-2"
                  onClick={() => setPreviewImage(imageUrl)}
                />
                <span className="text-sm text-gray-700 text-center break-words">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Other fields (notes/text/boolean) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {Object.entries(data).map(([key, value]) => {
          const isNoteField =
            key.toLowerCase() === "notes" ||
            key.toLowerCase().endsWith("_notes");

          const isImageField =
            typeof value === "string" &&
            (value.endsWith(".png") ||
              value.endsWith(".jpg") ||
              value.endsWith(".jpeg") ||
              value.endsWith(".svg"));

          const isBoolean = typeof value === "boolean";

          if (isImageField) return null; // already displayed at the top

          if (isNoteField) {
            return (
              <div
                key={key}
                className="col-span-full bg-white p-3 rounded-lg border border-gray-200"
              >
                <span className="font-medium text-sm">{formatTitle(key)}:</span>
                <p className="mt-1 text-gray-700 text-sm leading-relaxed">
                  {String(value)}
                </p>
              </div>
            );
          }

          return (
            <div key={key} className="flex gap-2 items-center min-w-0">
              <span className="font-medium text-sm flex-shrink-0">
                {formatTitle(key)}:
              </span>

              {isBoolean ? (
                <Badge
                  className={
                    value
                      ? "bg-black text-white"
                      : "bg-white text-black border border-black"
                  }
                >
                  {value ? "True" : "False"}
                </Badge>
              ) : (
                <span className="text-gray-600 text-sm break-words">
                  {String(value)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Dialog for image preview */}
      <Dialog.Root
        open={!!previewImage}
        onOpenChange={() => setPreviewImage(null)}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] max-w-[90vw]">
          <VisuallyHidden>
            <Dialog.Title>Image Preview</Dialog.Title>
            <Dialog.Description>
              Preview of the selected document image
            </Dialog.Description>
          </VisuallyHidden>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] rounded-lg"
            />
          )}
          <Dialog.Close asChild>
            <button className="absolute top-2 right-2 text-white bg-black/50 px-3 py-1 rounded">
              Close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

function formatTitle(key: string) {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
