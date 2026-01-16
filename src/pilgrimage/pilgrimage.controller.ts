import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseInterceptors,
  Get,
  UploadedFiles,
  Query,
  Put,
  Req,
  Param,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { successResponse } from 'src/core/config/response';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PilgrimageService } from './pilgrimage.service';
import { PilgrimageDto } from './dto/pilgrimage.dto';
import { UpdatePilgrimageDto } from './dto/update-pilgrimage.dto';
import { UpdatePilgrimagePackageDto } from 'src/pilgrimage-package/dto/update-pilgrimage-package.dto';
import { PilgrimagePackageDto } from 'src/pilgrimage-package/dto/pilgrimage-package.dto';

@Controller('api/v1/pilgrimage')
@ApiTags('This section is the CRUD endpoint for Pilgrimage/Hajj')
export class PilgrimageController {
  constructor(private readonly pilgrimageService: PilgrimageService) {}

  @Post()
  @ApiOperation({
    summary: 'This is to add or create pilgrimage/hajj',
    description: ``,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Moulud Umrah',
          description: 'Name of Hajj Pilgrimage',
          nullable: false,
        },
        about: {
          type: 'string',
          description: 'Hajj / Pilgrimage description',
          nullable: false,
        },
        benefits: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['Luxury accommodation', 'Guided tours', 'Transportation'],
          description: 'Benefit of pilgrimage in arrays',
          nullable: false,
        },
        duration: {
          type: 'number',
          example: 10,
          description: 'Duration or number of days',
          nullable: false,
        },
        image: {
          type: 'string',
          format: 'binary',
          nullable: false,
        },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @ApiResponse({ status: 200, description: 'Pilgrimage created' })
  @ApiResponse({ status: 401, description: 'Error performing task' })
  async create(
    @Body() pilgrimageDto: PilgrimageDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    const data = await this.pilgrimageService.create(pilgrimageDto, files);
    return successResponse({
      message: 'Pilgrimage created',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Get()
  @ApiOperation({
    summary:
      'Get pilgrimage details with optional search, filter, and pagination',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
    description: 'Number of items per page (default: 20)',
  })
  @ApiQuery({
    name: 'pilgrimageId',
    required: false,
    type: String,
    example: '6960eb838b23cbaf11774ba5',
    description: 'This should be mongo id',
  })
  @ApiResponse({
    status: 200,
    description: 'Pilgrimage Details details retrieved',
  })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async fetch(
    @Query('search') search?: string,
    @Query('pilgrimageId') pilgrimageId?: string,
    @Query('page')
    page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    const data = await this.pilgrimageService.fetchPilgrimage({
      pilgrimageId,
      search,
      page,
      limit,
    });

    return {
      message: 'Pilgrimage Details details retrieved',
      code: HttpStatus.OK,
      status: 'success',
      ...data,
    };
  }

  //update pilgrimage controller
  @Put('')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update pilgrimage/hajj details' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Moulud Umrah',
          description: 'Name of Hajj Pilgrimage',
          nullable: true,
        },
        about: {
          type: 'string',
          description: 'Hajj / Pilgrimage description',
          nullable: true,
        },
        benefits: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['Luxury accommodation', 'Guided tours', 'Transportation'],
          description: 'Benefit of pilgrimage in arrays',
          nullable: true,
        },
        duration: {
          type: 'number',
          example: 10,
          description: 'Duration or number of days',
          nullable: true,
        },
        image: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @ApiResponse({ status: 200, description: 'Update successful' })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async update(
    @Query('id') id: string,
    @Body()
    updatePilgrimageDto: UpdatePilgrimageDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    const data = await this.pilgrimageService.update(
      id,
      updatePilgrimageDto,
      files,
    );
    return {
      message: 'Update successful',
      code: HttpStatus.OK,
      status: 'success',
      data,
    };
  }

  /**pilgrimage package */
  @Post('package')
  @ApiOperation({
    summary: 'Add Pilgrimage package details',
    description: `Post Pilgrimage package`,
  })
  @ApiBody({ type: PilgrimagePackageDto })
  @ApiResponse({
    status: 200,
    description: 'Pilgrimage Package details created',
  })
  @ApiResponse({ status: 401, description: 'Error performing task' })
  async package(@Body() pilgrimagePackageDto: PilgrimagePackageDto) {
    const data =
      await this.pilgrimageService.createPilgrimagePackage(
        pilgrimagePackageDto,
      );
    return successResponse({
      message: 'Pilgrimage Package details created',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  /**Pilgrimage package */
  @Put('package/:id')
  @ApiOperation({
    summary: 'update Pilgrimage package',
    description: `All Payload are optional`,
  })
  @ApiBody({ type: UpdatePilgrimagePackageDto })
  @ApiResponse({
    status: 200,
    description: 'Pilgrimage Package details updated',
  })
  @ApiResponse({ status: 401, description: 'Error performing task' })
  async packageUpdate(
    @Param('id') id: string,
    @Body() updatePilgrimagePackageDto: UpdatePilgrimagePackageDto,
  ) {
    const data = await this.pilgrimageService.updatePilgriamgePackage(
      id,
      updatePilgrimagePackageDto,
    );
    return successResponse({
      message: 'Pilgrimage Package details updated',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Get('package')
  @ApiOperation({
    summary:
      'Get pilgrimage packages by pilgrimage id with optional search and pagination in the query parameters',
  })
  @ApiQuery({
    name: 'pilgrimageId',
    required: true,
    type: String,
    description: 'MongoDB id of the pilgrimage in the query params',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
  })
  @ApiResponse({ status: 200, description: 'Pilgrimage packages retrieved' })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async fetchPackages(
    @Query('pilgrimageId') pilgrimageId: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const data = await this.pilgrimageService.fetchPilgrimagePackages({
      pilgrimageId,
      search,
      page,
      limit,
    });

    return {
      message: 'Pilgrimage packages retrieved',
      code: HttpStatus.OK,
      status: 'success',
      ...data,
    };
  }
}
