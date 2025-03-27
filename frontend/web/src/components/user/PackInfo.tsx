import { useEffect } from 'react';
import { useUserPackStore } from '../../store/packCounter';

export const PackInfo = () => {
  const { 
    userPack, 
    userPackClassesIncluded, 
    setUserPack, 
    setUserPackClassesIncluded,
    setPackExpirationDate
  } = useUserPackStore();

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3000/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {        
        if (data.current_pack) {
          setUserPack(data.current_pack.name);
          // Asegurando que classes_remaining sea number
          setUserPackClassesIncluded(Number(data.classes_remaining) || 0);
          setPackExpirationDate(data.pack_expiration_date);
        } else {
          setUserPack('No tienes un pack asignado');
          setUserPackClassesIncluded(null);
          setPackExpirationDate(null);
        }
      })
      .catch((err) => {
        console.error('Error al obtener el pack del usuario:', err);
        setUserPack('Error al cargar el pack');
        setUserPackClassesIncluded(null);
      });
  }, [userId]);

  const renderClassesText = () => {
    if (userPackClassesIncluded === null) return 'Libre';
    
    return userPackClassesIncluded === 0 ? (
      <span className="text-red-300">0 (agotado)</span>
    ) : (
      userPackClassesIncluded
    );
  };

  return (
    <div className="bg-purple-800 text-white p-6 rounded-xl shadow-lg mb-6 text-center">
      <h2 className="text-lg font-semibold">Tu Pack Actual:</h2>
      <p className="text-2xl font-bold">{userPack}</p>
      
      <div className="mt-2">
        <p className="text-xl">
          Clases restantes: <span className="font-semibold">{renderClassesText()}</span>
        </p>
        
        {userPackClassesIncluded !== null && userPackClassesIncluded > 0 && (
          <p className="text-sm mt-1">
            {userPackClassesIncluded} clase{userPackClassesIncluded !== 1 ? 's' : ''} disponible
            {userPackClassesIncluded !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
};