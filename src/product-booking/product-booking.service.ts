import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { paginate } from 'src/utils/utils';
import {
  ProductBooking,
  ProductBookingDocument,
} from './schemas/product-booking.schema';
import { ProductBookingDto } from './dto/product-booking.dto';
import { UpdateProductBookingDto } from './dto/update-product-booking.dto';

@Injectable()
export class ProductBookingService {
  constructor(
    @InjectModel(ProductBooking.name)
    private productBookingModel: Model<ProductBookingDocument>,
  ) {}

  async create(client: string, productBookingDto: ProductBookingDto) {
    try {
      const booking = await this.productBookingModel.create({
        client,
        ...productBookingDto,
      });

      return booking;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  // fetch product booking
  async fetch(query: {
    productBookingId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      let filter: any = {};
      if (query.productBookingId) {
        filter._id = new mongoose.Types.ObjectId(query.productBookingId);
      }

      if (query.search) {
        const regex = new RegExp(query.search, 'i');
        filter.$or = [{ name: regex }, { nationality: regex }];
      }

      const modelQuery = this.productBookingModel
        .find(filter)
        .populate({ path: 'productPackage' })
        .populate({ path: 'client' })
        .sort({ createdAt: -1 });
      const pagination = await paginate(modelQuery, query.page, query.limit);

      return {
        productBookings: pagination.data,
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

  /**update product booking */
  async update(id: string, updateProductBookingDto: UpdateProductBookingDto) {
    try {
      const productBooking = await this.productBookingModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        updateProductBookingDto,
        { new: true, runValidators: true },
      );

      if (!updateProductBookingDto)
        throw new BadRequestException('Invalid product booking id');

      return productBooking;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }
}
