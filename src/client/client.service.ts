import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  generateApiKey,
  hashApiKey,
} from 'src/core/common/utils/authentication';
import { JwtService } from '@nestjs/jwt';
import { Client, ClientDocument } from './schemas/client.schema';
import { ClientDto } from './dto/client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    private jwtService: JwtService,
  ) {}

  async create(clientDto: ClientDto) {
    try {
      const existing = await this.clientModel.findOne({
        email: clientDto.email,
      });
      if (existing) throw new BadRequestException('Client already exists');

      const apiKey = generateApiKey();
      const apiKeyHash = hashApiKey(apiKey);

      const client = await this.clientModel.create({
        ...clientDto,
        apiKeyHash,
      });

      return {
        id: client._id,
        name: client.name,
        email: client.email,
        apiKey, // returned ONCE
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  /**authenticate client service */
  async authenticate(apiKey: string) {
    if (!apiKey) {
      throw new BadRequestException('x-access-key header is required');
    }
    const apiKeyHash = hashApiKey(apiKey);
    const client = await this.clientModel.findOne({
      apiKeyHash,
      isActive: true,
    });

    if (!client) {
      throw new BadRequestException('Invalid API key');
    }

    const payload = {
      sub: client._id.toString(),
      type: 'client',
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
