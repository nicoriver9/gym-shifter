// src/payments/payments.controller.ts
import { Controller, Post, Body, Req, Get, Param, NotFoundException, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  
  @Get('all-links')
  async getAllPaymentLinks(@Query('user_id') userId: string) {
    // Lista de packs disponibles
    const packs = [
      {
        id: 1,
        name: '2 Clases x Semana',
        price: 18000,
      },
      {
        id: 2,
        name: '3 Clases x Semana',
        price: 20000,
      },
      {
        id: 3,
        name: '4 Clases x Semana',
        price: 25000,
      },
      {
        id: 4,
        name: '5 Clases x Semana',
        price: 28000,
      },
      {
        id: 5,
        name: 'Pase Libre',
        price: 30000,
      },
    ];

    // Generar los links de pago para cada pack
    const paymentLinks = await Promise.all(
      packs.map(async (pack) => {
        const paymentLink = await this.paymentsService.createPaymentLink(
          Number(userId),
          pack.id,
        );
        return {
          packId: pack.id,
          packName: pack.name,
          price: pack.price,
          paymentLink,
        };
      }),
    );

    return paymentLinks;
  }

  @Get('link')
  async getPaymentLink(
    @Query('user_id') userId: string,
    @Query('pack_id') packId: string,
  ) {
    try {
      const paymentLink = await this.paymentsService.createPaymentLink(
        Number(userId),
        Number(packId),
      );
      return { paymentLink };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request) {
    const data = req.body;
    return this.paymentsService.handleWebhook(data);
  }

  @Get('success')
  async paymentSuccess(
    @Query('user_id') userId: string,
    @Query('pack_id') packId: string,
    @Query('payment_id') paymentId: string,
    @Query('status') status: string,
  ) {
    // Registrar el pago en la base de datos
    await this.paymentsService.registerPayment(
      Number(userId),
      Number(packId),
      paymentId,
      status,
    );

    return { message: 'Pago exitoso', userId, packId, paymentId, status };
  }

  @Get('failure')
  async paymentFailure(
    @Query('user_id') userId: string,
    @Query('pack_id') packId: string,
    @Query('payment_id') paymentId: string,
    @Query('status') status: string,
  ) {
    // Registrar el pago en la base de datos
    await this.paymentsService.registerPayment(
      Number(userId),
      Number(packId),
      paymentId,
      status,
    );

    return { message: 'Pago fallido', userId, packId, paymentId, status };
  }

  @Get('pending')
  async paymentPending(
    @Query('user_id') userId: string,
    @Query('pack_id') packId: string,
    @Query('payment_id') paymentId: string,
    @Query('status') status: string,
  ) {
    // Registrar el pago en la base de datos
    await this.paymentsService.registerPayment(
      Number(userId),
      Number(packId),
      paymentId,
      status,
    );

    return { message: 'Pago pendiente', userId, packId, paymentId, status };
  }
}