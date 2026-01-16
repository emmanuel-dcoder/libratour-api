import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Query,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { successResponse } from 'src/core/config/response';
import { TourBookingService } from './tour-booking.service';
import { TourBookingDto } from './dto/tour-booking.dto';
import { UpdateTourBookingDto } from './dto/update-tour-booking.dto';

@Controller('api/v1/tour-booking')
@ApiTags('This section is the CRUD endpoint for tour booking')
export class TourBookingController {
  constructor(private readonly tourBookingService: TourBookingService) {}

  @Post()
  @ApiOperation({
    summary: 'This is to add or create tour booking',
    description: `Tour Booking`,
  })
  @ApiBody({ type: TourBookingDto })
  @ApiResponse({ status: 200, description: 'Tour Booking created' })
  @ApiResponse({ status: 401, description: 'Error performing task' })
  async create(@Body() tourBookingDto: TourBookingDto) {
    const data = await this.tourBookingService.create(tourBookingDto);
    return successResponse({
      message: 'Tour Booking created',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Get()
  @ApiOperation({
    summary:
      'Get tour booking details with optional search, filter, and pagination',
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
    name: 'tourBookingId',
    required: false,
    type: String,
    example: '624f048d886a86063a88f1d2',
    description: 'This should be mongo id',
  })
  @ApiResponse({ status: 200, description: 'Tour Booking details retrieved' })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async fetch(
    @Query('search') search?: string,
    @Query('tourBookingId') tourBookingId?: string,
    @Query('page')
    page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    const data = await this.tourBookingService.fetch({
      tourBookingId,
      search,
      page,
      limit,
    });

    return {
      message: 'Tour Booking details retrieved',
      code: HttpStatus.OK,
      status: 'success',
      ...data,
    };
  }

  //update tour controller
  @Put('')
  @ApiOperation({ summary: 'Update tour booking details' })
  @ApiBody({ type: UpdateTourBookingDto })
  @ApiResponse({ status: 200, description: 'Update successful' })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async updateTour(
    @Query('id') id: string,
    @Body()
    updateTourBookingDto: UpdateTourBookingDto,
  ) {
    const data = await this.tourBookingService.update(id, updateTourBookingDto);
    return {
      message: 'Update successful',
      code: HttpStatus.OK,
      status: 'success',
      data,
    };
  }
}
