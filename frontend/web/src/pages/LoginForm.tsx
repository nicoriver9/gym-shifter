import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
// import AOS from "aos";
import "aos/dist/aos.css";

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

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
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Ocurrió un error inesperado al iniciar sesión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const decodedToken: any = jwtDecode(credentialResponse.credential);

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

      if (response.status === 401) {
        throw new Error(data.message || "Error al autenticar con Google");
      }

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      onLogin();
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setErrorMessage((error as Error).message || "Ocurrió un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.log("Error en el login con Google");
    setErrorMessage("Error al iniciar sesión con Google");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <div
        className="bg-gray-800 p-8 rounded-lg shadow-md w-96 text-center"
        data-aos="zoom-in"
        data-aos-duration="2000"
      >
        <img
          src="/img/logo-gym-active-png.png"
          alt="Gym Active Logo"
          className="w-32 mx-auto mb-4"
        />

        <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2>

        {errorMessage && (
          <div className="mb-4 p-2 bg-red-600 text-white rounded">
            {errorMessage}
          </div>
        )}

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

          {isLoading && (
            <div className="mt-4">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}
        </form>

        <div className="my-4 border-t border-gray-600"></div>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>
      </div>

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
