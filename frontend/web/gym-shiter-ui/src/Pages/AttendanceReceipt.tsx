import { useRef } from "react";
import { Button, Container } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";

const AttendanceReceipt = () => {
    const receiptRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
    });

    return (
        <Container className="text-center mt-4">
            <h2>Comprobante de Asistencia</h2>
            <div ref={receiptRef} className="border p-3 mt-3">
                <h4>Gimnasio Activo</h4>
                <p>Fecha: {new Date().toLocaleDateString()}</p>
                <p>Nombre del alumno: Juan Pérez</p>
                <p>Clase asistida: CrossFit</p>
            </div>
            <Button variant="primary" className="mt-3" onClick={handlePrint}>
                Exportar a PDF
            </Button>
        </Container>
    );
};

export default AttendanceReceipt;
