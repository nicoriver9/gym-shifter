import { useEffect, useState } from "react";
import { getPacks } from "../../services/admin/packService";
// import { getPaymentLink } from "../../services/admin/paymentService";
import { PackInfo } from "../../components/user/PackInfo";
import { useUserPackStore } from "../../store/packCounter";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const PacksPage = () => {
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userPackClassesIncluded, userPack } = useUserPackStore();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 600 });
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
      <div className="flex justify-center items-center min-h-screen" data-aos="fade-up">
        <div className="text-center">
          <p className="text-white text-lg mb-3">Cargando packs...</p>
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <PackInfo />

      {canBuyMorePacks() ? (
        <>
          <h2 className="text-2xl md:text-3xl font-semibold text-white text-center mb-6">
            Packs Disponibles
          </h2>

          <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-lg" data-aos="fade-up">
            <table className="min-w-full text-white">
              <thead>
                <tr className="bg-gray-700 text-sm uppercase tracking-wide">
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
                      <td className="px-6 py-4 text-center">{pack.validity_days}</td>
                      <td className="px-6 py-4 text-center flex justify-center">
                        <div className="flex flex-col items-center gap-2 sm:flex-row">
                          {/* 
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
                            onClick={() => handleBuyPack(pack.id)}
                          >
                            Comprar
                          </button>
                          */}
                          <button
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition"
                            onClick={() => navigate("/payment/alias")}
                          >
                            Comprar Pack
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      No hay packs disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-blue-900 text-white p-6 rounded-lg shadow-md text-center mt-6" data-aos="fade-up">
          <h3 className="text-xl font-semibold mb-2">Ya tienes un pack activo</h3>
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
