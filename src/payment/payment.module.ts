import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import {
  Transaction,
  TransactionSchema,
} from 'src/transaction/schemas/transaction.schema';
import { TransactionService } from 'src/transaction/services/transaction.service';
import { NotificationService } from 'src/notification/services/notification.service';
import { MailService } from 'src/core/mail/email';
import {
  NotificationSchema,
  Notification,
} from 'src/notification/schemas/notification.schema';
import { Client, ClientSchema } from 'src/client/schemas/client.schema';
import {
  ProductPackage,
  ProductPackageSchema,
} from 'src/product-package/schemas/product-package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Client.name, schema: ClientSchema },
      { name: ProductPackage.name, schema: ProductPackageSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, TransactionService],
})
export class PaymentModule {}
