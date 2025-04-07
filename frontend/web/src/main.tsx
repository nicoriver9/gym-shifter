import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId= import.meta.env.VITE_GOOGLEOAUTHPROVIDER_CLIENTID;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={googleClientId} >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider >
);
