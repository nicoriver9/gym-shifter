// src/payments/payments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { mercadoPagoPayment } from '../config/mercadopago.config';
import { CreatePaymentDto } from './dto/create-payment.dto';
import MercadoPagoConfig, { Preference } from 'mercadopago';

@Injectable()
export class PaymentsService {
  private readonly mercadoPagoClient: MercadoPagoConfig;
  private readonly mercadoPagoPreference: Preference;

  constructor(private prisma: PrismaService) {
    // Configurar el cliente de MercadoPago
    this.mercadoPagoClient = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });

    // Inicializar el recurso de preferencias
    this.mercadoPagoPreference = new Preference(this.mercadoPagoClient);
  }

  async createPaymentLink(userId: number, packId: number) {
    // Buscar el usuario en la base de datos
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // Buscar el pack en la base de datos
    const pack = await this.prisma.pack.findUnique({
      where: { id: packId },
    });

    if (!pack) {
      throw new NotFoundException(`Pack con ID ${packId} no encontrado`);
    }

    // Crear la preferencia de pago en MercadoPago
    const preferenceData = {
      items: [
        {
          id: pack.id.toString(), // ID del pack
          title: pack.name,
          unit_price: pack.price,
          quantity: 1,
          currency_id: 'ARS', // Moneda: pesos argentinos
        },
      ],
      back_urls: {
        success: `http://localhost:3000/payments/success?user_id=${userId}&pack_id=${packId}`, // URL de éxito
        failure: `http://localhost:3000/payments/failure?user_id=${userId}&pack_id=${packId}`, // URL de fallo
        pending: `http://localhost:3000/payments/pending?user_id=${userId}&pack_id=${packId}`, // URL de pago pendiente
      },
      auto_return: 'approved', // Redirigir automáticamente al usuario después del pago
      external_reference: `${userId}-${packId}`, // Referencia externa para identificar el pago
    };

    const preference = await this.mercadoPagoPreference.create({ body: preferenceData });

    // Devolver el link de pago
    return preference.init_point; // URL de pago generada por MercadoPago
  }

  async registerPayment(
    userId: number,
    packId: number,
    paymentId: string,
    status: string,
  ) {
    // Registrar el pago en la base de datos
    await this.prisma.payment.create({
      data: {
        userId,
        packId,
        amount: (await this.prisma.pack.findUnique({ where: { id: packId } })).price,
        status,
        mercadoPagoId: paymentId,
      },
    });
  }

  async handleWebhook(data: any) {
    const { id, status } = data;

    // Actualizar el estado del pago en la base de datos
    await this.prisma.payment.update({
        where: { mercadoPagoId: id }, 
        data: { status },
      });

    return { success: true };
  }
}   