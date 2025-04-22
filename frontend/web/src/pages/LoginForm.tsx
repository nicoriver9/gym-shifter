// src/components/LoginForm.tsx
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // Para decodificar el token de Google
import "aos/dist/aos.css";

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para el mensaje de error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Limpiar el mensaje de error antes de intentar el login

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 401 || !data.access_token) {
        throw new Error(data.message || "Credenciales incorrectas");
      }

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      // Guardar los datos en el localStorage
      localStorage.setItem("firstName", data.firstName);
      localStorage.setItem("lastName", data.lastName);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      if (data.access_token) {
        onLogin();
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      // ✅ Verificamos si error es una instancia de Error antes de acceder a error.message
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Ocurrió un error inesperado al iniciar sesión.");
      }
    }
  };


  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decodedToken: any = jwtDecode(credentialResponse.credential);
      console.log("Usuario autenticado con Google:", decodedToken);

      // Realizar la solicitud POST a la API de autenticación con Google
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: decodedToken.email,
          google_id: decodedToken.sub,
          firstName: decodedToken.given_name,
          lastName: decodedToken.family_name,
        }),
      });

      const data = await response.json();

      // Verificar el código de estado de la respuesta
      if (response.status === 401) {
        throw new Error(data.message || "Error al autenticar con Google");
      }

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      // Guardar los datos en el localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      // Llamar a la función onLogin para redirigir al usuario
      onLogin();
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setErrorMessage((error as Error).message || "Ocurrió un error inesperado.");
    }
  };

  const handleGoogleError = () => {
    console.log("Error en el login con Google");
    setErrorMessage("Error al iniciar sesión con Google");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      {/* Contenedor principal del Login */}
      <div
        className="bg-gray-800 p-8 rounded-lg shadow-md w-96 text-center"
        data-aos="zoom-in"
        data-aos-duration="2000"
      >
        {/* Logo */}
        <img
          src="/img/logo-gym-active-png.png"
          alt="Gym Active Logo"
          className="w-32 mx-auto mb-4"
        />

        <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2>

        {/* Mensaje de error */}
        {errorMessage && (
          <div className="mb-4 p-2 bg-red-600 text-white rounded">
            {errorMessage}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-left mb-1">Usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-left mb-1">Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded font-medium transition"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="my-4 border-t border-gray-600"></div>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full mt-6 text-center text-xs text-gray-400 px-4 sm:px-0">
        Sitio creado por{" "}
        <a
          href="https://www.cuyoweb.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white no-underline font-semibold hover:text-purple-400"
        >
          Cuyoweb
        </a>{" "}
        © {new Date().getFullYear()} - Todos los derechos reservados.
      </footer>


    </div>
  );

};

export default LoginForm;