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
import { HotelService } from './hotel.service';
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
import { HotelDto } from './dto/hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { HotelPackageDto } from 'src/hotel-package/dto/hotel-package.dto';
import { UpdateHotelPackageDto } from 'src/hotel-package/dto/update-hotel-package.dto';

@Controller('api/v1/hotel')
@ApiTags('This section is the CRUD endpoint for hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  @ApiOperation({
    summary: 'This is to add or create hotel',
    description: ``,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'name',
        'about',
        'singleDoublePricing',
        'tripplePricing',
        'quadPricing',
        'amenities',
      ],
      properties: {
        name: {
          type: 'string',
          example: 'Fairmont Makkah Clock Hotel',
        },
        location: {
          type: 'string',
          example: 'Makkah, Saudi Arabia',
          nullable: true,
        },
        about: {
          type: 'string',
          example:
            'Experience luxury and comfort at Fairmont Makkah Clock Hotel...',
        },
        singleDoublePricing: {
          type: 'string',
          example: '$7,925/person',
        },
        tripplePricing: {
          type: 'string',
          example: '$6,100/person',
        },
        quadPricing: {
          type: 'string',
          example: '$5,170/person',
        },
        rating: {
          type: 'number',
          example: 4.7,
          nullable: true,
        },
        amenities: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['Free WiFi', 'Parking', 'Coffee Shop'],
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
  @ApiResponse({ status: 200, description: 'Hotel created' })
  @ApiResponse({ status: 401, description: 'Error performing task' })
  async create(
    @Body() hotelDto: HotelDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    const data = await this.hotelService.create(hotelDto, files);
    return successResponse({
      message: 'Hotel created',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Get hotel details with optional search, filter, and pagination',
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
    name: 'hotelId',
    required: false,
    type: String,
    example: '624f048d886a86063a88f1d2',
    description: 'This should be mongo id',
  })
  @ApiResponse({ status: 200, description: 'Hotel Details details retrieved' })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async fetch(
    @Req() req: any,
    @Query('search') search?: string,
    @Query('hotelId') hotelId?: string,
    @Query('page')
    page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    const data = await this.hotelService.fetchHotel({
      hotelId,
      search,
      page,
      limit,
    });

    return {
      message: 'Hotel details retrieved',
      code: HttpStatus.OK,
      status: 'success',
      ...data,
    };
  }

  //update hotel controller
  @Put('')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update hotel details' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Fairmont Makkah Clock Hotel',
          description: 'Hotel name',
          nullable: true,
        },
        singleDoublePricing: {
          type: 'string',
          example: '$7,925/person',
          description: 'Price for single or double person',
          nullable: true,
        },
        tripplePricing: {
          type: 'string',
          example: '$6,100/person',
          description: 'Price for tripple person',
          nullable: true,
        },
        quadPricing: {
          type: 'string',
          example: '$5,170/person',
          description: 'Price for quad person',
          nullable: true,
        },
        rating: {
          type: 'number',
          example: 4.7,
          description: 'Rating between 0 and 5',
          nullable: true,
        },
        image: { type: 'string', format: 'binary', nullable: true },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @ApiResponse({ status: 200, description: 'Update successful' })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async updateHotel(
    @Query('id') id: string,
    @Body()
    updateHotelDto: UpdateHotelDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    const data = await this.hotelService.update(id, updateHotelDto, files);
    return {
      message: 'Update successful',
      code: HttpStatus.OK,
      status: 'success',
      data,
    };
  }

  /**hotel package */
  @Post('package')
  @ApiOperation({
    summary: 'Add Hotel package details',
    description: `Post Hotel package`,
  })
  @ApiBody({ type: HotelPackageDto })
  @ApiResponse({ status: 200, description: 'Hotel Package details created' })
  @ApiResponse({ status: 401, description: 'Error performing task' })
  async hotelPackage(@Body() hotelPackageDto: HotelPackageDto) {
    const data = await this.hotelService.createHotelPackage(hotelPackageDto);
    return successResponse({
      message: 'Hotel Package details created',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  /**hotel package */
  @Put('package/:id')
  @ApiOperation({
    summary: 'update hotel package',
    description: `All Payload are optional`,
  })
  @ApiBody({ type: UpdateHotelPackageDto })
  @ApiResponse({ status: 200, description: 'Hotel Package details updated' })
  @ApiResponse({ status: 401, description: 'Error performing task' })
  async hotelPackageUpdate(
    @Param('id') id: string,
    @Body() updateHotelPackageDto: UpdateHotelPackageDto,
  ) {
    const data = await this.hotelService.updateHotelPackage(
      id,
      updateHotelPackageDto,
    );
    return successResponse({
      message: 'Hotel Package details updated',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Get('package')
  @ApiOperation({
    summary:
      'Get hotel packages by hotel id with optional search and pagination in the query parameters',
  })
  @ApiQuery({
    name: 'hotelId',
    required: true,
    type: String,
    description: 'MongoDB id of the hotel in the query params',
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
  @ApiResponse({ status: 200, description: 'Hotel packages retrieved' })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async fetchHotelPackages(
    @Query('hotelId') hotelId: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const data = await this.hotelService.fetchHotelPackages({
      hotelId,
      search,
      page,
      limit,
    });

    return {
      message: 'Hotel packages retrieved',
      code: HttpStatus.OK,
      status: 'success',
      ...data,
    };
  }
}
