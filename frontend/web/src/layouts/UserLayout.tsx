import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";


const UserLayout = () => {
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
            <Navbar firstName={firstName} lastName={lastName} onLogout={handleLogout} />
            <div className="w-full max-w-4xl">
                <Outlet />
            </div>
        </div>
    );
};

export default UserLayout;
