import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Client, NoAuth } from 'whatsapp-web.js';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as QRCode from 'qrcode';

// import { filter } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private client: Client;
  private clientStatus$ = new BehaviorSubject<string>('initializing');
  private qrCodeSubject$ = new BehaviorSubject<string | null>(null);
  private clientInfo: any = null;

  constructor(private readonly prisma: PrismaService) {
    this.initializeClient();
  }

  private initializeClient() {
    const os = require('os');
    const isLinux = os.platform() === 'linux';

    this.client = new Client({
      authStrategy: new NoAuth(),
      puppeteer: isLinux
        ? {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
          }
        : undefined,
    });

    this.client.on('qr', async (qr: string) => {
      this.clientStatus$.next('qr');

      try {
        const qrImage = await QRCode.toDataURL(qr); // 🔥 genera imagen base64
        this.qrCodeSubject$.next(qrImage);
        this.logger.log('✅ QR generado y convertido a imagen base64');
      } catch (err) {
        this.logger.error('❌ Error generando imagen del QR:', err);
      }
    });

    this.client.on('ready', () => {
      this.clientStatus$.next('ready');
      this.clientInfo = this.client.info;
      this.logger.log('✅ WhatsApp client listo.');
    });

    this.client.on('authenticated', () => {
      this.clientStatus$.next('authenticated');
      this.logger.log('🔐 WhatsApp client autenticado.');
    });

    this.client.on('disconnected', (reason) => {
      this.clientStatus$.next('disconnected');
      this.logger.warn(`⚠️ WhatsApp client desconectado. Motivo: ${reason}`);
    });

    this.client.initialize();
  }

  getQRCode(): Observable<string | null> {
    return of(this.qrCodeSubject$.getValue());
  }

  getClientStatus(): Observable<string> {
    return this.clientStatus$.asObservable();
  }

  getQRCodeSync(): string | null {
    return this.qrCodeSubject$.getValue();
  }

  async restartClient(): Promise<void> {
    try {
      this.logger.log('♻️ Reiniciando WhatsApp client...');

      if (this.client) {
        await this.client.destroy();
      }

      this.clearAuthAndCacheFolders();
      this.initializeClient();

      this.logger.log('✅ WhatsApp client reiniciado correctamente.');
    } catch (error) {
      this.logger.error('Error al reiniciar WhatsApp client:', error);
      throw new Error('Failed to restart WhatsApp client.');
    }
  }

  private clearAuthAndCacheFolders() {
    const fs = require('fs');
    const path = require('path');

    const authFolderPath = path.join(__dirname, '..', '..', '.wwebjs_auth');
    const cacheFolderPath = path.join(__dirname, '..', '..', '.wwebjs_cache');

    try {
      fs.rmSync(authFolderPath, { recursive: true, force: true });
      fs.rmSync(cacheFolderPath, { recursive: true, force: true });
      this.logger.log('🗑️ Folders de auth y cache limpiados.');
    } catch (error) {
      this.logger.error('Error limpiando folders de auth/cache:', error);
    }
  }

  // FUNCIÓN PRINCIPAL DE RECORDATORIOS:
  async sendPackExpirationReminders(): Promise<void> {
    const status = this.clientStatus$.getValue();

    if (status !== 'authenticated' && status !== 'ready') {
      this.logger.warn(
        `🚫 No se enviaron recordatorios porque la sesión de WhatsApp no está activa. Estado actual: ${status}`,
      );
      return;
    }

    this.logger.log('🟡 Buscando usuarios con pack a vencer mañana...');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const usersToRemind = await this.prisma.user.findMany({
      where: {
        isActive: true,
        phone: { not: null },
        pack_expiration_date: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
      },
    });

    this.logger.log(`🟢 Usuarios encontrados: ${usersToRemind.length}`);

    const successfulReminders: { name: string; phone: string }[] = [];

    for (const user of usersToRemind) {
      const phoneNumber = user.phone!.replace('+', '').replace(/\D/g, '');
      const message = `¡Hola ${user.firstName}! 🏋️‍♀️\n\nTe recordamos que tu pack de clases en *Gym Active App* vencerá mañana.\n\nSi deseas renovarlo, podés hacerlo desde la aplicación o contactándonos.\n\n¡Seguimos entrenando juntos! 💪`;

      try {
        await this.client.sendMessage(`${phoneNumber}@c.us`, message);
        this.logger.log(
          `✅ Recordatorio enviado a ${user.firstName} (${phoneNumber})`,
        );

        successfulReminders.push({
          name: `${user.firstName} ${user.lastName}`,
          phone: phoneNumber,
        });

        await this.prisma.userAudit.create({
          data: {
            user_id: user.id,
            action: 'PACK_EXPIRATION_REMINDER_SENT',
            details: `Se envió recordatorio de vencimiento de pack al usuario ${user.email}`,
            ip_address: null,
          },
        });
      } catch (error) {
        this.logger.error(
          `❌ Error enviando recordatorio a ${user.firstName} (${phoneNumber}): ${error.message}`,
        );
      }
    }

    this.logger.log('🟣 Proceso de recordatorios de packs finalizado.');

    if (successfulReminders.length > 0) {
      const adminUsers = await this.prisma.user.findMany({
        where: {
          role: 'Admin',
          phone: { not: null },
        },
      });

      const resumen =
        `📋 Recordatorios enviados hoy:\n` +
        successfulReminders.map((u) => `- ${u.name} (${u.phone})`).join('\n') +
        `\nTotal: ${successfulReminders.length} usuarios`;

      for (const admin of adminUsers) {
        const adminPhone = admin.phone!.replace('+', '').replace(/\D/g, '');
        try {
          await this.client.sendMessage(`${adminPhone}@c.us`, resumen);
          this.logger.log(`📨 Resumen enviado al admin ${admin.firstName}`);
        } catch (error) {
          this.logger.error(
            `❌ Error enviando resumen al admin ${admin.firstName} (${adminPhone}): ${error.message}`,
          );
        }
      }
    } else {
      this.logger.log(
        '📭 No se enviaron recordatorios hoy. No se notificó a los admins.',
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleDailyReminderCron() {
    this.logger.log(
      '🕘 CRON ACTIVADO: Enviando recordatorios automáticos de packs...',
    );
    await this.sendPackExpirationReminders();
  }
}
