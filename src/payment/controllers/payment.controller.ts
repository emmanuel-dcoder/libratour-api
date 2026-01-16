import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
  Get,
  Headers,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { JwtAuthGuard } from 'src/core/guard/jwt/jwt-auth.guard';
import { CreateTransactionDto } from 'src/transaction/dto/create-transaction.dto';
import * as crypto from 'crypto';
import { Response, Request } from 'express';
import { envConfig } from 'src/core/config/env.config';

@ApiTags('Payment')
@Controller('api/v1/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initialize')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Initialize payment with Lotus Bank',
    description:
      'Creates a pending Lotus payment and returns authorization URL',
  })
  async initialize(
    @Body() transactionDto: CreateTransactionDto,
    @Req() req: any,
  ) {
    const client = req.user.clientId;
    return this.paymentService.initializePayment(client, transactionDto);
  }

  @Get('verify/:reference')
  @ApiOperation({
    summary: 'Verify Lotus payment',
    description: 'Verifies payment status using Lotus reference',
  })
  async verifyPayment(@Param('reference') reference: string) {
    const transaction = await this.paymentService.verifyPayment(reference);

    return transaction;
  }

  @Get('transaction/:reference')
  async getTransactionByReference(@Param('reference') reference: string) {
    return this.paymentService.getTransactionByReference(reference);
  }

  @Get('status/:reference')
  @ApiOperation({
    summary: 'Fetch manual checkout status from Lotus',
    description: 'Fetches the latest checkout status directly from Lotus API',
  })
  async getCheckoutStatus(@Param('reference') reference: string) {
    return this.paymentService.fetchCheckoutStatus(reference);
  }

  //**webhook controller */
  @Post()
  async handleWebhook(
    @Req() req: Request & { rawBody?: string },
    @Headers('signature') signature: string,
    @Res() res: Response,
  ) {
    const computedHash = crypto
      .createHmac('sha512', envConfig.lotus.secretKey)
      .update(req.rawBody)
      .digest('hex');

    if (computedHash !== signature) {
      return res.status(HttpStatus.UNAUTHORIZED).send('Invalid signature');
    }
    await this.paymentService.processWebhookEvent(req.body);
    return res.status(HttpStatus.OK).send('Webhook received');
  }
}
