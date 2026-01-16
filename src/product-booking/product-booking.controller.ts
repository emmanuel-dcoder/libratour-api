import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Query,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { successResponse } from 'src/core/config/response';
import { ProductBookingService } from './product-booking.service';
import { ProductBookingDto } from './dto/product-booking.dto';
import { UpdateProductBookingDto } from './dto/update-product-booking.dto';
import { JwtAuthGuard } from 'src/core/guard/jwt/jwt-auth.guard';
import { AdminAuthGuard } from 'src/core/guard/admin-jwt/jwt-auth.guard';

@Controller('api/v1/product-booking')
@ApiTags('This section is the CRUD endpoint for feature or product booking')
export class ProductBookingController {
  constructor(private readonly productBookingService: ProductBookingService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({
    summary: 'Create a product booking',
    description: 'Creates a booking for a selected product package',
  })
  @ApiBody({ type: ProductBookingDto })
  @ApiResponse({ status: 200, description: 'Product Booking created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() productBookingDto: ProductBookingDto, @Req() req: any) {
    const client = req.user.clientId;

    const data = await this.productBookingService.create(
      client,
      productBookingDto,
    );

    return successResponse({
      message: 'Product Booking created',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Get('/admin')
  @ApiOperation({
    summary:
      'Get product booking details with optional search, filter, and pagination',
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
    name: 'productBookingId',
    required: false,
    type: String,
    example: '6967b0c735fdc8916bd7e824',
    description: 'This should be mongo id',
  })
  @ApiResponse({
    status: 200,
    description: 'Product Booking details retrieved',
  })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async fetch(
    @Query('search') search?: string,
    @Query('productBookingId') productBookingId?: string,
    @Query('page')
    page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    const data = await this.productBookingService.fetch({
      productBookingId,
      search,
      page,
      limit,
    });

    return {
      message: 'Product Booking details retrieved',
      code: HttpStatus.OK,
      status: 'success',
      ...data,
    };
  }

  //update product booking controller
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Put('/admin')
  @ApiOperation({ summary: 'Update product booking details' })
  @ApiBody({ type: UpdateProductBookingDto })
  @ApiResponse({ status: 200, description: 'Update successful' })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async updateBooking(
    @Query('id') id: string,
    @Body()
    updateProductBookingDto: UpdateProductBookingDto,
  ) {
    const data = await this.productBookingService.update(
      id,
      updateProductBookingDto,
    );
    return {
      message: 'Update successful',
      code: HttpStatus.OK,
      status: 'success',
      data,
    };
  }
}
