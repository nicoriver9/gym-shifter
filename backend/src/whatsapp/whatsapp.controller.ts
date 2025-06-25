import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { Observable, of } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { Request } from 'express';

@Controller('api/whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @UseGuards(JwtAuthGuard)
  @Get('get-qr')
  getQRCode(): any {
    const qr = this.whatsappService.getQRCodeSync();
    if (!qr) {
      throw new HttpException(
        'QR no disponible',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    return {
      qrCode: qr,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  getClientStatus(): Observable<string> {
    return this.whatsappService.getClientStatus().pipe(take(1)); 
  }

  @UseGuards(JwtAuthGuard)
  @Post('restart-client')
  async restartClient(@Req() request: Request) {
    try {
      await this.whatsappService.restartClient();
      return { message: 'WhatsApp client restarted successfully' };
    } catch (error) {
      throw new HttpException(
        `Error restarting WhatsApp client: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-pack-reminders')
  async sendPackReminders() {
    try {
      await this.whatsappService.sendPackExpirationReminders();
      return { message: 'Recordatorios de packs enviados correctamente.' };
    } catch (error) {
      throw new HttpException(
        `Error al enviar recordatorios: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
