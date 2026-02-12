import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as path from 'path';
import { envConfig } from '../config/env.config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly mailTransport;

  constructor() {
    this.mailTransport = nodemailer.createTransport({
      host: envConfig.mail.host,
      port: Number(envConfig.mail.port),
      secure: true, // MUST be true for port 465
      auth: {
        user: envConfig.mail.user,
        pass: envConfig.mail.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection
    this.mailTransport.verify((error, success) => {
      if (error) {
        this.logger.error('Mail transport verification failed:', error);
      } else {
        this.logger.log('Mail transport is ready.');
      }
    });
  }

  private async getTemplate(templateName: string): Promise<string> {
    const templatePath = path.join(
      process.cwd(),
      'templates',
      `${templateName}.hbs`,
    );

    this.logger.log(`Loading template from: ${templatePath}`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template ${templateName}.hbs not found`);
    }

    return fs.promises.readFile(templatePath, 'utf8');
  }

  async sendMailNotification(
    to: string,
    subject: string,
    substitutionParams: Record<string, any>,
    templateName: string,
    options?: { from?: string; cc?: string; bcc?: string },
  ): Promise<void> {
    try {
      const {
        from = '"Libra Gold Group" <noreply@libragoldgroup.com>',
        cc,
        bcc,
      } = options || {};

      const templateSource = await this.getTemplate(templateName);
      const compiledTemplate = handlebars.compile(templateSource);

      await this.mailTransport.sendMail({
        from,
        to,
        cc,
        bcc,
        subject,
        html: compiledTemplate(substitutionParams),
      });

      this.logger.log(`Email successfully sent to ${to}`);
    } catch (error) {
      this.logger.error(
        `Error sending email to ${to}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
