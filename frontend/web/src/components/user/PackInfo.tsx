import { useEffect } from "react";
import { useUserPackStore } from "../../store/packCounter";

export const PackInfo = () => {
  const {
    userPack,
    userPackClassesIncluded,
    packExpirationDate,
    // weeklyCycleStartDate,
    setUserPack,
    setUserPackClassesIncluded,
    setPackExpirationDate,
    setWeeklyCycleStartDate,
  } = useUserPackStore();

  const fetchUserPack = async (retries = 3) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const accessToken = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");

    if (!userId || !accessToken) return;

    try {
      const res = await fetch(`${apiUrl}/api/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Respuesta no válida");

      const data = await res.json();

      if (data.current_pack) {
        setUserPack(data.current_pack.name);
        setUserPackClassesIncluded(Number(data.classes_remaining) || 0);
        setPackExpirationDate(data.pack_expiration_date);

        const startDate =
          data.last_class_reset || data.pack_expiration_date || null;
        setWeeklyCycleStartDate(startDate);
      } else {
        setUserPack("No tienes un pack asignado");
        setUserPackClassesIncluded(null);
        setPackExpirationDate(null);
        setWeeklyCycleStartDate(null);
      }
    } catch (error) {
      if (retries > 0) {
        setTimeout(() => fetchUserPack(retries - 1), 1000);
      } else {
        console.error("❌ Error al obtener el pack del usuario:", error);
        setUserPack("Error al cargar el pack");
        setUserPackClassesIncluded(null);
        setPackExpirationDate(null);
        setWeeklyCycleStartDate(null);
      }
    }
  };

  useEffect(() => {
    fetchUserPack();
  }, []);

  const calculateDaysRemaining = (dateString: string) => {
    const today = new Date();
    const endDate = new Date(dateString);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // const calculateWeeklyCycleDaysRemaining = (startDateStr: string, cycleLengthDays = 7) => {
  //   const today = new Date();
  //   const startDate = new Date(startDateStr);
  //   const msInDay = 1000 * 60 * 60 * 24;
  //   const diffMs = today.getTime() - startDate.getTime();
  //   const daysSinceStart = Math.floor(diffMs / msInDay);
  //   const daysPassedInCurrentCycle = daysSinceStart % cycleLengthDays;
  //   const daysRemaining = cycleLengthDays - daysPassedInCurrentCycle;
  //   return daysRemaining;
  // };

  const renderPackInfo = () => {
    if (
      !userPack ||
      userPack === "No tienes un pack asignado" ||
      userPack === "Error al cargar el pack"
    ) {
      return <p className="text-2xl font-bold text-center">{userPack}</p>;
    }

    const daysRemainingPack = packExpirationDate
      ? calculateDaysRemaining(packExpirationDate)
      : null;

    // const daysRemainingWeekly = weeklyCycleStartDate
    //   ? calculateWeeklyCycleDaysRemaining(weeklyCycleStartDate)
    //   : null;

    const isUnlimited = userPackClassesIncluded === 9999;

    return (
      <>
        <p className="text-2xl font-bold text-center">{userPack}</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-purple-900 p-3 rounded-lg">
            <p className="text-sm text-purple-300 text-center">
              Clases restantes
            </p>
            <p className="text-xl font-semibold text-center">
              {isUnlimited ? "Ilimitadas" : userPackClassesIncluded}
              {!isUnlimited && userPackClassesIncluded === 0 && (
                <span className="text-red-300 ml-1">(agotado)</span>
              )}
            </p>
          </div>

          <div className="bg-purple-900 p-3 rounded-lg">
            <p className="text-sm text-purple-300 text-center">
              Días restantes del pack
            </p>
            <p className="text-xl font-semibold text-center">
              {daysRemainingPack !== null ? daysRemainingPack : "N/A"}
              {daysRemainingPack !== null && daysRemainingPack <= 3 && (
                <span className="text-yellow-300 ml-1">(pronto a vencer)</span>
              )}
            </p>
          </div>

          {/* <div className="text-center bg-purple-900 p-3 rounded-lg col-span-2">
            <p className="text-sm text-purple-300 text-center">
              Días restantes del ciclo semanal
            </p>
            <p className="text-xl font-semibold text-center">
              {daysRemainingWeekly !== null ? daysRemainingWeekly : "N/A"}
              {daysRemainingWeekly !== null && daysRemainingWeekly <= 2 && (
                <span className="text-yellow-300 ml-1">(se renueva pronto)</span>
              )}
            </p>
            {weeklyCycleStartDate && (() => {
              const start = new Date(weeklyCycleStartDate);
              const now = new Date();
              const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
              const completedCycles = Math.floor(diffDays / 7);
              const nextReset = new Date(start.getTime() + (completedCycles + 1) * 7 * 24 * 60 * 60 * 1000);
              return (
                <p className="text-center text-xs text-purple-300 mt-1">
                  Próxima renovación:{" "}
                  <span className="font-bold">
                    {nextReset.toLocaleDateString()}
                  </span>
                </p>
              );
            })()}
          </div> */}
        </div>
      </>
    );
  };

  return (
    <div className="bg-purple-800 text-white p-6 rounded-xl shadow-lg mb-6">
      <h2 className="text-lg font-semibold text-center mb-2">Tu Pack Actual</h2>
      {renderPackInfo()}
    </div>
  );
};
