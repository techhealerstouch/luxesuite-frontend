import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QrCode, Link as LinkIcon, X } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { apiService } from "@/lib/api-service";
import { useToast } from "@/hooks/use-toast";

interface ReferenceCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authenticatedProductId: number;
}

export function ReferenceCodeDialog({
  open,
  onOpenChange,
  authenticatedProductId,
}: ReferenceCodeDialogProps) {
  const [view, setView] = useState<"input" | "scanner">("input");
  const [refCode, setRefCode] = useState("");
  const [scanned, setScanned] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [status, setStatus] = useState<"valid" | "invalid" | "loading" | null>(
    null
  );
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const { toast } = useToast();

  // Safe stop function
  const stopVideo = () => {
    try {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current!.srcObject = null;
      }
    } catch (err) {
      console.warn("Failed to stop video tracks:", err);
    }
  };

  // Scanner effect
  useEffect(() => {
    let stopScanner: (() => void) | null = null;

    if (view === "scanner" && videoRef.current) {
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      // Start scanning
      codeReader
        .decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
          if (result && !scanned) {
            const scannedUrl = result.getText();
            const scannedCode = scannedUrl.split("/").pop() || "";
            setRefCode(scannedCode);
            setScanned(true);
            setView("input");
            stopScanner?.();
          }

          if (err && !err.toString().includes("NotFoundException")) {
            console.error("QR Scan Error:", err);
          }
        })
        .then((stoppable) => {
          stopScanner = () => {
            try {
              stoppable.stop(); // stops internal decoding loop
            } catch {}
            stopVideo(); // stops the video stream
            codeReaderRef.current = null;
          };
        })
        .catch((err) => {
          console.error("Camera error:", err);
          setCameraError("Cannot access camera. Please check permissions.");
          stopVideo();
          codeReaderRef.current = null;
        });

      // Clean up on unmount or view change
      return () => {
        stopScanner?.();
      };
    }
  }, [view, scanned]);

  // Validate reference code
  useEffect(() => {
    if (!refCode) return;

    setStatus("loading");

    const checkRefCode = async () => {
      try {
        const res = await apiService.refCodeNfcCheckValidity({
          ref_code: refCode,
        });
        if (res.valid) {
          setStatus("valid");
          setMessage(res.message);
        } else {
          setStatus("invalid");
          setMessage(res.message);
        }
      } catch {
        setStatus("invalid");
        setMessage("Failed to check reference code");
      }
    };

    checkRefCode();
  }, [refCode]);

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setView("input");
      setRefCode("");
      setScanned(false);
      setCameraError("");
      setStatus(null);
      setMessage("");
      stopVideo();
      codeReaderRef.current = null;
    }
  }, [open]);

  // Submit handler
  const handleSubmit = async () => {
    if (!refCode) return;

    setSubmitLoading(true);

    try {
      const res = await apiService.patchNfcLink({
        ref_code: refCode,
        authenticated_product_id: authenticatedProductId,
      });
      console.log(res);
      if (res.success === true) {
        toast({
          title: "Success",
          description: res.message,
        });
      } else {
          setStatus("invalid");
          setMessage(res.message);
      }

      //onOpenChange(false);
    } catch (err: any) {
          setStatus("invalid");
          setMessage(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {view === "input" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Link your NFC card
              </DialogTitle>
              <DialogDescription>
                Provide a reference code manually or scan a QR code from your
                NFC card.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Reference Code</label>
                <Input
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  placeholder="Enter reference code"
                />
                {status && (
                  <p
                    className={`mt-2 text-sm ${
                      status === "valid" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </div>

              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={status !== "valid" || submitLoading}
              >
                {submitLoading ? "Linking..." : "Link"}
              </Button>

              <div className="flex items-center justify-center text-gray-400">
                <span className="text-sm">Or</span>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setView("scanner");
                  setScanned(false);
                  setCameraError("");
                }}
              >
                <QrCode className="w-4 h-4 mr-2" />
                Scan QR code
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Scan QR Code
              </DialogTitle>
            </DialogHeader>

            {cameraError ? (
              <div className="text-red-600 text-center">{cameraError}</div>
            ) : (
              <div className="relative w-full h-80">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                <div
                  className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white"></div>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              className="flex items-center gap-2 text-red-600"
              onClick={() => setView("input")}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
