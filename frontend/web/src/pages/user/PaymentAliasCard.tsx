// src/pages/user/PaymentAliasCard.tsx
import { FiCopy } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

const PaymentAliasCard = () => {
  const [copied, setCopied] = useState(false);
  const alias = "gymactive.mp";
  const whatsappNumber = "+5492613831659"; // Número fijo
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hola! Te envío el comprobante de pago para mi pack.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(alias);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-[#0F172A] p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-white mb-6">Alias de Pago</h1>

        <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-3 rounded-lg">
          <span className="text-lg font-mono">{alias}</span>
          <button
            onClick={handleCopy}
            className="text-purple-400 hover:text-purple-600 transition"
          >
            <FiCopy size={20} />
          </button>
        </div>

        {copied && (
          <p className="text-green-500 mt-2 text-sm">¡Alias copiado!</p>
        )}

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition"
        >
          <FaWhatsapp className="mr-2" /> Enviar Comprobante por WhatsApp
        </a>
      </div>
    </div>
  );
};

export default PaymentAliasCard;
