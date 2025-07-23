import React from "react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-10">
      <div className="bg-gray-800 text-gray-300 p-8 rounded-lg shadow-lg max-w-3xl w-full text-sm leading-relaxed">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          Política de Privacidad
        </h2>

        <p className="mb-4">
          En <strong>GymActiveApp</strong> respetamos tu privacidad y nos
          comprometemos a proteger la información personal que compartís con
          nosotros. Esta Política de Privacidad describe cómo recopilamos,
          utilizamos y protegemos tus datos en nuestra plataforma.
        </p>

        <h3 className="text-white font-semibold mb-2 mt-6">
          1. Datos que recopilamos
        </h3>
        <p className="mb-4">
          La única información personal que almacenamos proviene del inicio de
          sesión con Google, y se limita a tu nombre, apellido, dirección de
          correo electrónico y tu identificador único de Google (<i>sub</i>). No
          recopilamos contraseñas ni accedemos a tu cuenta de Google más allá de
          lo necesario para autenticarte.
        </p>

        <h3 className="text-white font-semibold mb-2 mt-6">
          2. Uso de la información
        </h3>
        <p className="mb-4">
          Utilizamos tu información únicamente para fines internos de
          autenticación, personalización de la experiencia del usuario y acceso
          a funcionalidades de la app. No compartimos ni vendemos tus datos a
          terceros bajo ninguna circunstancia.
        </p>

        <h3 className="text-white font-semibold mb-2 mt-6">
          3. Seguridad de los datos
        </h3>
        <p className="mb-4">
          Implementamos medidas técnicas y organizativas apropiadas para
          proteger tu información contra accesos no autorizados, pérdida o
          destrucción. Nuestro sistema sigue buenas prácticas de desarrollo
          seguro y almacenamiento cifrado.
        </p>

        <h3 className="text-white font-semibold mb-2 mt-6">
          4. Conservación de la información
        </h3>
        <p className="mb-4">
          Conservamos tu información solo mientras sea necesaria para los fines
          descritos en esta política o hasta que solicites su eliminación, lo
          cual podés hacer escribiéndonos.
        </p>

        <h3 className="text-white font-semibold mb-2 mt-6">
          5. Derechos del usuario
        </h3>
        <p className="mb-4">
          Como usuario, tenés derecho a acceder, rectificar y eliminar tus datos
          personales, así como a oponerte a ciertos tratamientos. Para ejercer
          estos derechos, comunicate con nosotros a través del correo
          electrónico indicado más abajo.
        </p>

        <h3 className="text-white font-semibold mb-2 mt-6">6. Contacto</h3>
        <p className="mb-4">
          Si tenés dudas, consultas o deseás ejercer tus derechos sobre tu
          información personal, podés escribirnos a{" "}
          <a
            href="mailto:cuyoweboficial@gmail.com"
            className="text-purple-400 underline"
          >
            cuyoweboficial@gmail.com
          </a>
          .
        </p>

        <p className="mt-6 text-xs text-gray-500 text-center italic">
          Última actualización: Julio 2025
        </p>
        {/* Botón para volver al login */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/login")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition transform duration-200 ease-in-out hover:scale-105"
          >
            Volver al login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
