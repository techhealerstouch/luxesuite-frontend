declare module "react-qr-scanner" {
  import * as React from "react";

  export interface QrScannerProps {
    delay?: number | false;
    onError?: (error: any) => void;
    onScan?: (data: string | null) => void;
    style?: React.CSSProperties;
    className?: string;
    constraints?: MediaStreamConstraints; // ✅ keep this
  }

  export default class QrScanner extends React.Component<QrScannerProps> {}
}
