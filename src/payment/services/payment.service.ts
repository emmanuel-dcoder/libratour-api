import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { TransactionService } from 'src/transaction/services/transaction.service';
import { envConfig } from 'src/core/config/env.config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto } from 'src/transaction/dto/create-transaction.dto';
import {
  ProductPackage,
  ProductPackageDocument,
} from 'src/product-package/schemas/product-package.schema';

@Injectable()
export class PaymentService {
  constructor(
    private readonly transactionService: TransactionService,
    @InjectModel(ProductPackage.name)
    private productPackageModel: Model<ProductPackageDocument>,
  ) {}

  async initializePayment(
    client: string,
    transactionDto: CreateTransactionDto,
  ) {
    const { productPackageId, quantity, paymentMethod } = transactionDto;

    const productPackage = await this.productPackageModel.findOne({
      _id: productPackageId,
    });

    if (!productPackage)
      throw new BadRequestException('Product package not found');

    const totalAmount = productPackage.price * quantity;

    const response = await axios.post(
      `${envConfig.lotus.baseUrl}/checkout/initialize`,
      {
        walletId: 'master',
        // returnUrl: 'https://google.com',
        currency: 'NGN',
        amount: totalAmount,
        metadata: {},
      },
      {
        headers: {
          Authorization: envConfig.lotus.publicKey,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.data?.success) {
      throw new BadRequestException(
        response.data?.message || 'Lotus initialization failed',
      );
    }

    await this.transactionService.createTransaction({
      productPackageId,
      reference: response.data.data.reference,
      paymentMethod,
      quantity,
      amount: totalAmount,
      clientId: client,
    });

    return {
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    };
  }

  async verifyPayment(reference: string) {
    const response = await axios.get(
      `${envConfig.lotus.baseUrl}/payment/verify/${reference}`,
      {
        headers: {
          'x-api-key': envConfig.lotus.secretKey,
        },
      },
    );

    if (!response.data.success)
      throw new BadRequestException('Payment verification failed');

    const transaction = await this.transactionService.updateTransactionStatus(
      reference,
      'success',
    );

    return transaction;
  }

  async getTransactionByReference(reference: string) {
    const transaction =
      await this.transactionService.findByReference(reference);

    if (!transaction) throw new BadRequestException('Transaction not found');

    return transaction;
  }

  //*fetch checkout */
  async fetchCheckoutStatus(reference: string) {
    try {
      console.log('reference', reference);
      const response = await axios.get(
        `${envConfig.lotus.baseUrl}/checkout/status/${reference}`,
        {
          headers: {
            'x-api-key': envConfig.lotus.secretKey,
          },
        },
      );
      console.log('response', response);
      if (!response.data?.success) {
        throw new BadRequestException(
          response.data?.message || 'Failed to fetch checkout status',
        );
      }

      return response.data;
    } catch (error) {
      throw new BadRequestException(
        error.response?.data?.message || 'Error fetching checkout status',
      );
    }
  }

  //**webhook service */
  async processWebhookEvent(event: any) {
    if (event?.service !== 'payments' || event?.data?.reference == null) {
      return;
    }

    const { status, reference, amount } = event.data;

    const transaction =
      await this.transactionService.findByReference(reference);

    if (!transaction) {
      return;
    }

    // Idempotency protection
    if (transaction.status === 'success') {
      return;
    }

    if (status === 'successful') {
      if (transaction.amount !== amount) {
        await this.transactionService.updateTransactionStatus(
          reference,
          'failed',
        );
        return;
      }

      await this.transactionService.updateTransactionStatus(
        reference,
        'success',
      );
    } else {
      await this.transactionService.updateTransactionStatus(
        reference,
        'failed',
      );
    }
  }
}
