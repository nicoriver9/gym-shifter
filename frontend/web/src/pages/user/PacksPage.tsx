import { useEffect, useState } from "react";
import { getPacks } from "../../services/admin/packService";
// import { getPaymentLink } from "../../services/admin/paymentService";
import { PackInfo } from "../../components/user/PackInfo";
import { useUserPackStore } from "../../store/packCounter";
import { useNavigate } from "react-router-dom"; // 👈 Importar navigate

const PacksPage = () => {
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userPackClassesIncluded, userPack } = useUserPackStore();
  const navigate = useNavigate(); // 👈 Instancia de navegación

  // const userId = Number(localStorage.getItem("user_id"));

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

  // const handleBuyPack = async (packId: number) => {
  //   try {
  //     const response = await getPaymentLink(userId, packId);
  //     const paymentLink = response.paymentLink;
  //     window.open(paymentLink, "_blank");
  //   } catch (error) {
  //     console.error("Error al obtener el link de pago:", error);
  //     alert("Error al obtener el link de pago");
  //   }
  // };

  const canBuyMorePacks = () => {
    return (
      !userPack ||
      userPack === "No tienes un pack asignado" ||
      userPack === "Error al cargar el pack" ||
      (userPackClassesIncluded !== null && userPackClassesIncluded <= 0)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-3 mt-8">
      <PackInfo />

      {canBuyMorePacks() ? (
        <>
          <h2 className="text-2xl font-semibold text-white text-center mb-4">
            Packs Disponibles
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 text-white rounded-lg shadow-md overflow-hidden">
              <thead>
                <tr className="bg-gray-700 text-white text-left text-sm uppercase tracking-wider">
                  <th className="px-6 py-3 text-center">ID</th>
                  <th className="px-6 py-3 text-center">Precio</th>
                  <th className="px-6 py-3 text-center">Clases Incluidas</th>
                  <th className="px-6 py-3 text-center">Validez (Días)</th>
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {packs.length > 0 ? (
                  packs.map((pack, i) => (
                    <tr
                      key={pack.id}
                      className="border-b border-gray-700 hover:bg-gray-800 transition"
                    >
                      <td className="px-6 py-4 text-center">{i + 1}</td>
                      <td className="px-6 py-4 text-center">${pack.price}</td>
                      <td className="px-6 py-4 text-center">{pack.name}</td>
                      <td className="px-6 py-4 text-center">
                        {pack.validity_days}
                      </td>
                      <td className="px-6 py-4 text-center flex flex-col gap-2 justify-center items-center">
                        {/* <button
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                          onClick={() => handleBuyPack(pack.id)}
                        >
                          Comprar
                        </button> */}

                        <button
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
                          onClick={() => navigate("/payment/alias")}
                        >
                          Comprar Pack
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-400">
                      No hay packs disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-blue-900 text-white p-6 rounded-lg shadow-md text-center mt-6">
          <h3 className="text-xl font-semibold mb-2">
            Ya tienes un pack activo
          </h3>
          <p>
            Actualmente tienes clases disponibles en tu pack. Podrás comprar un
            nuevo pack cuando tu actual esté agotado o próximo a vencer.
          </p>
        </div>
      )}
    </div>
  );
};

export default PacksPage;
