// src/config/mercadopago.config.ts
import { MercadoPagoConfig, Payment } from 'mercadopago';
import * as dotenv from 'dotenv';
dotenv.config();

// Configura el cliente de MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,   // Tu access token de MercadoPago
});

// Exporta el cliente y los recursos que necesites
export const mercadoPagoClient = client;
export const mercadoPagoPayment = new Payment(client);