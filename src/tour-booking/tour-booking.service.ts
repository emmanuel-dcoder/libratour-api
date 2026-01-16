import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { TourBookingDto } from './dto/tour-booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  TourBooking,
  TourBookingDocument,
} from './schemas/tour-booking.schema';
import mongoose, { Model } from 'mongoose';
import { paginate } from 'src/utils/utils';
import { UpdateTourBookingDto } from './dto/update-tour-booking.dto';

@Injectable()
export class TourBookingService {
  constructor(
    @InjectModel(TourBooking.name)
    private tourBookingModel: Model<TourBookingDocument>,
  ) {}

  async create(tourBookingDto: TourBookingDto) {
    try {
      const tourBooking = await this.tourBookingModel.create(tourBookingDto);
      return tourBooking;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  /**get tour booing list */
  async fetch(query: {
    tourBookingId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      let filter: any = {};
      if (query.tourBookingId) {
        filter._id = new mongoose.Types.ObjectId(query.tourBookingId);
      }

      if (query.search) {
        const regex = new RegExp(query.search, 'i');
        filter.$or = [
          { firstName: regex },
          { lastName: regex },
          { nationality: regex },
        ];
      }

      const modelQuery = this.tourBookingModel
        .find(filter)
        .populate('tourPackage')
        .sort({ createdAt: -1 });
      const pagination = await paginate(modelQuery, query.page, query.limit);

      return {
        tourBooking: pagination.data,
        total: pagination.total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /**update tour booking */
  async update(id: string, updateTourBookingDto: UpdateTourBookingDto) {
    try {
      const tourBooking = await this.tourBookingModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        updateTourBookingDto,
        { new: true, runValidators: true },
      );

      if (!tourBooking)
        throw new BadRequestException('Invalid tour booking id');

      return tourBooking;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }
}
