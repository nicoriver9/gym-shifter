// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboard from "./Pages/Navigation";
import PacksPage from "./Pages/PacksPage"; // Asegúrate de crear esta página
import QRScannerPage from "./Pages/QRScannerPage";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/packs" element={<PacksPage />} />
        <Route path="/qr-scanner" element={<QRScannerPage />} /> {/* Nueva ruta */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;