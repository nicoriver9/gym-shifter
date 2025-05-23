// src/components/user/Navbar.tsx
import { FiLogOut } from "react-icons/fi";

interface NavbarProps {
    firstName: string | null;
    lastName: string | null;
    onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ firstName, lastName, onLogout }) => {
    return (
        <header className="w-full max-w-4xl flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow mb-8">
            <div className="flex-grow">
                <h1 className="text-2xl font-bold text-center">
                    Hola!! {firstName} {lastName}
                </h1>
            </div>
            <button
                onClick={onLogout}
                className="w-14 h-11 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-full transition"
            >
                <FiLogOut className="text-xl text-white" />
                <span className="sr-only">Cerrar Sesión</span>
            </button>
        </header>
    );
};
