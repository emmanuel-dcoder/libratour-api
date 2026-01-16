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
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TourService } from './tour.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { successResponse } from 'src/core/config/response';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateTourDto } from './dto/tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { CreateTourPackageDto } from 'src/tour-package/dto/tour-package.dto';
import { UpdateTourPackageDto } from 'src/tour-package/dto/update-tour-package.dto';
import { JwtAuthGuard } from 'src/core/guard/jwt/jwt-auth.guard';

@Controller('api/v1/tour')
@ApiTags('This section is the CRUD endpoint for tours')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  @ApiOperation({
    summary: 'This is to add or create tour data',
    description: ``,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Egypt Explorer',
          description: 'This is the name or title of the tour location',
          nullable: false,
        },
        location: {
          type: 'string',
          example: 'Cairo, Luxor, Aswan',
          description: 'This is the locations for the tour',
          nullable: false,
        },
        price: {
          type: 'number',
          example: '1200',
          description: 'This is the price for the tour',
          nullable: false,
        },
        discountPrice: {
          type: 'number',
          example: '1200',
          description: 'This is the discount charge for the tour',
          nullable: false,
        },
        benefits: {
          type: 'array',
          items: { type: 'string' },
          example: ['Hot air balloon ride', 'Hagia Sophia'],
          nullable: false,
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
  @ApiResponse({ status: 200, description: 'Tour created' })
  @ApiResponse({ status: 401, description: 'Error performing task' })
  async create(
    @Body() createTourDto: CreateTourDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    const data = await this.tourService.create(createTourDto, files);
    return successResponse({
      message: 'Tour created',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Get tour details with optional search, filter, and pagination',
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
    name: 'tourId',
    required: false,
    type: String,
    example: '624f048d886a86063a88f1d2',
    description: 'This should be mongo id',
  })
  @ApiResponse({ status: 200, description: 'Tour details retrieved' })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async fetch(
    @Req() req: any,
    @Query('search') search?: string,
    @Query('tourId') tourId?: string,
    @Query('page')
    page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    console.log('req', req);
    const data = await this.tourService.fetchTour({
      tourId,
      search,
      page,
      limit,
    });

    return {
      message: 'Tour details retrieved',
      code: HttpStatus.OK,
      status: 'success',
      ...data,
    };
  }

  //update tour controller
  @Put('')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update tour details' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Egypt Explorer',
          description: 'This is the name or title of the tour location',
          nullable: true,
        },
        location: {
          type: 'string',
          example: 'Cairo, Luxor, Aswan',
          description: 'This is the locations for the tour',
          nullable: true,
        },
        price: {
          type: 'number',
          example: '1200',
          description: 'This is the price for the tour',
          nullable: true,
        },
        discountPrice: {
          type: 'number',
          example: '1200',
          description: 'This is the discount charge for the tour',
          nullable: true,
        },
        benefits: {
          type: 'array',
          items: { type: 'string' },
          example: ['Hot air balloon ride', 'Hagia Sophia'],
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
  async updateTour(
    @Query('id') id: string,
    @Body()
    updateTourDto: UpdateTourDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    const data = await this.tourService.update(id, updateTourDto, files);
    return {
      message: 'Update successful',
      code: HttpStatus.OK,
      status: 'success',
      data,
    };
  }

  /**tour package */
  @Post('package')
  @ApiOperation({
    summary: 'Add tour package details',
    description: ``,
  })
  @ApiBody({ type: CreateTourPackageDto })
  @ApiResponse({ status: 200, description: 'Tour Package details created' })
  @ApiResponse({ status: 401, description: 'Error performing task' })
  async tourPackage(@Body() createTourPackageDto: CreateTourPackageDto) {
    const data = await this.tourService.createTourPackage(createTourPackageDto);
    return successResponse({
      message: 'Tour Package details created',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  /**tour package */
  @Put('package/:id')
  @ApiOperation({
    summary: 'update tour package',
    description: `All Payload are optional`,
  })
  @ApiBody({ type: UpdateTourPackageDto })
  @ApiResponse({ status: 200, description: 'Tour Package details updated' })
  @ApiResponse({ status: 401, description: 'Error performing task' })
  async tourPackageUpdate(
    @Param('id') id: string,
    @Body() updateTourPackageDto: UpdateTourPackageDto,
  ) {
    const data = await this.tourService.updateTourPackage(
      id,
      updateTourPackageDto,
    );
    return successResponse({
      message: 'Tour Package details updated',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Get('package')
  @ApiOperation({
    summary:
      'Get tour packages by tour id with optional search and pagination in the query parameters',
  })
  @ApiQuery({
    name: 'tourId',
    required: true,
    type: String,
    description: 'MongoDB id of the tour in the query params',
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
  @ApiResponse({ status: 200, description: 'Tour packages retrieved' })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async fetchTourPackages(
    @Query('tourId') tourId: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const data = await this.tourService.fetchTourPackages({
      tourId,
      search,
      page,
      limit,
    });

    return {
      message: 'Tour packages retrieved',
      code: HttpStatus.OK,
      status: 'success',
      ...data,
    };
  }
}
