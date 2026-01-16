import { Controller, Post, Body, HttpStatus, Headers } from '@nestjs/common';
import { ClientService } from './client.service';

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { successResponse } from 'src/core/config/response';
import { ClientDto } from './dto/client.dto';

@Controller('api/v1/client')
@ApiTags('Onboarding client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({
    summary: 'Onboard client details',
  })
  @ApiBody({ type: ClientDto })
  @ApiResponse({ status: 200, description: 'Client created' })
  @ApiResponse({ status: 401, description: 'Error performing task' })
  async create(@Body() clientDto: ClientDto) {
    const data = await this.clientService.create(clientDto);
    return successResponse({
      message: 'Client created',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  /**authenticate client*/
  @Post('authenticate')
  @ApiOperation({
    summary:
      'Authenticate client using API key, the access token last for 10 days',
  })
  @ApiResponse({ status: 200, description: 'Returns access token' })
  async authenticate(@Headers('x-access-key') apiKey: string) {
    const data = await this.clientService.authenticate(apiKey);
    return successResponse({
      message: 'Authentication successful',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }
}
