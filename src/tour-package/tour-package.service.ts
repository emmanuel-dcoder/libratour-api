import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateTourPackageDto } from './dto/tour-package.dto';
import { InjectModel } from '@nestjs/mongoose';
import { paginate } from 'src/utils/utils';
import {
  TourPackage,
  TourPackageDocument,
} from './schemas/tour-package.schema';
import { UpdateTourPackageDto } from './dto/update-tour-package.dto';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class TourPackageService {
  constructor(
    @InjectModel(TourPackage.name)
    private tourPackageModel: Model<TourPackageDocument>,
  ) {}

  async create(createTourPackageDto: CreateTourPackageDto) {
    try {
      const tourPackage =
        await this.tourPackageModel.create(createTourPackageDto);

      return tourPackage;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async update(id: string, updateTourPackageDto: UpdateTourPackageDto) {
    try {
      const tourPackage = await this.tourPackageModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { ...updateTourPackageDto },
        { new: true, runValidators: true },
      );

      if (!tourPackage)
        throw new BadRequestException('Invalid tour package id');

      return tourPackage;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /**get tour list */
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

      const modelQuery = this.tourPackageModel
        .find(filter)
        .populate('tour')
        .sort({ createdAt: -1 });
      const pagination = await paginate(modelQuery, query.page, query.limit);

      return {
        tourPackages: pagination.data,
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
  async fetchByTour(query: {
    tourId: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const filter: any = {
        tour: new mongoose.Types.ObjectId(query.tourId),
      };

      if (query.search) {
        const regex = new RegExp(query.search, 'i');
        filter.$or = [{ name: regex }];
      }

      const modelQuery = this.tourPackageModel
        .find(filter)
        .populate('tour')
        .sort({ createdAt: -1 });

      const pagination = await paginate(modelQuery, query.page, query.limit);

      return {
        tourPackages: pagination.data,
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
