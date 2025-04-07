// src/components/admin/PaymentTable.tsx
import { useEffect, useState } from "react";
import { getApprovedPayments } from "../../services/admin/paymentService";

const PaymentTable = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const totalIncome = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await getApprovedPayments();
      setPayments(data);
    } catch (error) {
      console.error("Error al obtener los pagos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-3 mt-8">
      <h2 className="text-2xl font-semibold text-white text-center mb-4">
        Registro de Pagos Aprobados
      </h2>

      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">
              Total de pagos: {payments.length}
            </h3>
            <p className="text-sm text-gray-400">Desde el inicio</p>
          </div>
          <div className="text-right">
            <h3 className="text-2xl font-bold text-green-400">
              ${totalIncome.toFixed(2)}
            </h3>
            <p className="text-sm text-gray-400">Ingresos totales</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 text-white rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-white text-left text-sm uppercase tracking-wider">
              <th className="px-6 py-3 text-center">ID</th>
              <th className="px-6 py-3 text-center">Usuario</th>
              <th className="px-6 py-3 text-center">Pack</th>
              <th className="px-6 py-3 text-center">Monto</th>
              <th className="px-6 py-3 text-center">Fecha</th>
              <th className="px-6 py-3 text-center">ID MercadoPago</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment, i) => (
                <tr
                  key={payment.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4 text-center">{i + 1}</td>
                  <td className="px-6 py-4 text-center">
                    {payment.user.firstName} {payment.user.lastName}
                  </td>
                  <td className="px-6 py-4 text-center">{payment.pack.name}</td>
                  <td className="px-6 py-4 text-center">${payment.amount}</td>
                  <td className="px-6 py-4 text-center">
                    {new Date(payment.createdAt).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {payment.mercadoPagoId || "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
                  No hay pagos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;
