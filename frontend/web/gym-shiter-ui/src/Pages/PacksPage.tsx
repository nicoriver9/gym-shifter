// src/components/PacksPage.tsx
import { useEffect, useState } from "react";
import { Table, Button, Container, Spinner } from "react-bootstrap";
import  { getPacks } from "../services/packService";
import { getPaymentLink } from "../services/paymentService";
import { useNavigate } from "react-router-dom";

const PacksPage = () => {
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    try {
      const data = await getPacks();
      setPacks(data);
    } catch (error) {
      console.error("Error al obtener los packs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPack = async (packId: number) => {
    try {
      // Obtener el link de pago desde el backend
      const response = await getPaymentLink(1, packId); // Reemplaza "1" con el ID del usuario
      const paymentLink = response.paymentLink;

      // Redirigir al usuario al link de pago
      window.location.href = paymentLink;
    } catch (error) {
      console.error("Error al obtener el link de pago:", error);
      alert("Error al obtener el link de pago");
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Packs Disponibles</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Clases Incluidas</th>
            <th>Precio</th>
            <th>Validez (Días)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {packs.length > 0 ? (
            packs.map((pack) => (
              <tr key={pack.id}>
                <td>{pack.id}</td>
                <td>{pack.name}</td>
                <td>{pack.classes_included}</td>
                <td>${pack.price}</td>
                <td>{pack.validity_days}</td>
                <td>
                  <Button variant="success" onClick={() => handleBuyPack(pack.id)}>
                    Comprar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                No hay packs disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default PacksPage;