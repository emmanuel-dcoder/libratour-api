import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './schemas/client.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from 'src/core/config/env.config';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { JwtStrategy } from 'src/core/guard/jwt/jwt.strategy';
import { MailService } from 'src/core/mail/email';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: `${envConfig.jwt.secret}`,
      signOptions: { expiresIn: `${envConfig.jwt.expiry}` },
    }),
  ],
  controllers: [ClientController],
  providers: [ClientService, JwtStrategy, MailService],
})
export class ClientModule {}
