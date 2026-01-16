import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { paginate } from 'src/utils/utils';
import mongoose, { Model } from 'mongoose';
import {
  HotelPackage,
  HotelPackageDocument,
} from './schemas/hotel-package.schema';
import { HotelPackageDto } from './dto/hotel-package.dto';
import { UpdateHotelPackageDto } from './dto/update-hotel-package.dto';

@Injectable()
export class HotelPackageService {
  constructor(
    @InjectModel(HotelPackage.name)
    private hotelPackageModel: Model<HotelPackageDocument>,
  ) {}

  async create(HotelPackageDto: HotelPackageDto) {
    try {
      const hotelPackage = await this.hotelPackageModel.create(HotelPackageDto);

      return hotelPackage;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async update(id: string, updateHotelPackageDto: UpdateHotelPackageDto) {
    try {
      const hotelPackage = await this.hotelPackageModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { ...updateHotelPackageDto },
        { new: true, runValidators: true },
      );

      if (!hotelPackage)
        throw new BadRequestException('Invalid tour package id');

      hotelPackage;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /**get hotel list */
  async fetch(query: {
    id?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      let filter: any = {};
      if (query.id) {
        filter._id = new mongoose.Types.ObjectId(query.id);
      }

      if (query.search) {
        const regex = new RegExp(query.search, 'i');
        filter.$or = [{ name: regex }];
      }

      const modelQuery = this.hotelPackageModel
        .find(filter)
        .populate('hotel')
        .sort({ createdAt: -1 });
      const pagination = await paginate(modelQuery, query.page, query.limit);

      return {
        hotelPackages: pagination.data,
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

  /** get tour packages by tour id */
  async fetchByHotel(query: {
    hotelId: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const filter: any = {
        hotel: new mongoose.Types.ObjectId(query.hotelId),
      };

      if (query.search) {
        const regex = new RegExp(query.search, 'i');
        filter.$or = [{ name: regex }];
      }

      const modelQuery = this.hotelPackageModel
        .find(filter)
        .populate('hotel')
        .sort({ createdAt: -1 });

      const pagination = await paginate(modelQuery, query.page, query.limit);

      return {
        hotelPackages: pagination.data,
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
}
