// src/components/QRScannerPage.tsx
import { useState } from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import { Scanner } from "@yudiel/react-qr-scanner";

const QRScannerPage = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = (data: any) => {
    if (data) {
      setScanResult(data);
      setError(null);
    }
  };

  const handleError = (err: any) => {
    console.error("Error al escanear el código QR:", err);
    setError("Error al escanear el código QR. Inténtalo de nuevo.");
  };

  if (!isMobile) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Alert variant="warning">
          Por favor, ingresa a la aplicación desde tu celular para usar el escáner de QR.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="text-center mt-4">
      <h1 className="mb-4">Escáner de QR</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {scanResult ? (
        <Alert variant="success">
          Código QR escaneado: <strong>{scanResult}</strong>
        </Alert>
      ) : (
        <Scanner
          onScan={handleScan}
          onError={handleError}
          constraints={{ facingMode: "environment" }} // Usar la cámara trasera
          styles={{finderBorder:1}}
        />
      )}
      {scanResult && (
        <Button variant="primary" onClick={() => setScanResult(null)} className="mt-3">
          Escanear otro código
        </Button>
      )}
    </Container>
  );
};

export default QRScannerPage;