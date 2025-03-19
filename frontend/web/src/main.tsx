import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from "@react-oauth/google";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="131177126744-k053vun9k99ovdv3rpv9p2l4c051pbbb.apps.googleusercontent.com" >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider >
);
