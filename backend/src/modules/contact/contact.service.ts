import { Injectable, InternalServerErrorException } from '@nestjs/common';

import * as nodemailer from 'nodemailer';

import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: Number(process.env.MAIL_PORT) === 465,

      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendMail(contactDto: ContactDto) {
    const { name, email, designation, subject, message } = contactDto;

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,

        replyTo: email,

        subject: `Portfolio Contact: ${subject}`,

        text: `
New message from your portfolio.

Name: ${name}
Email: ${email}
Designation: ${designation || 'Not provided'}

Subject:
${subject}

Message:
${message}
        `.trim(),
      });

      return {
        success: true,
        message: 'Your message has been sent successfully.',
      };
    } catch (error) {
      console.error('Failed to send contact email:', error);

      throw new InternalServerErrorException(
        'Failed to send your message. Please try again later.',
      );
    }
  }
}
