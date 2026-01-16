import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { paginate } from 'src/utils/utils';
import mongoose, { Model } from 'mongoose';
import { PilgrimagePackageDto } from './dto/pilgrimage-package.dto';
import { UpdatePilgrimageDto } from 'src/pilgrimage/dto/update-pilgrimage.dto';
import {
  PilgrimagePackage,
  PilgrimagePackageDocument,
} from './schemas/pilgrimage-package.schema';

@Injectable()
export class PilgrimagePackageService {
  constructor(
    @InjectModel(PilgrimagePackage.name)
    private pilgrimagePackageModel: Model<PilgrimagePackageDocument>,
  ) {}

  async create(pilgrimagePackageDto: PilgrimagePackageDto) {
    try {
      const pilgrimage =
        await this.pilgrimagePackageModel.create(pilgrimagePackageDto);

      return pilgrimage;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async update(id: string, updatePilgrimageDto: UpdatePilgrimageDto) {
    try {
      const pilgrimage = await this.pilgrimagePackageModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { ...updatePilgrimageDto },
        { new: true, runValidators: true },
      );

      if (!pilgrimage)
        throw new BadRequestException('Invalid pilgrimage package id');

      pilgrimage;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /**get pilgrimage list */
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

      const modelQuery = this.pilgrimagePackageModel
        .find(filter)
        .populate('pilgrimage')
        .sort({ createdAt: -1 });
      const pagination = await paginate(modelQuery, query.page, query.limit);

      return {
        pilgrimagePackages: pagination.data,
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

  /** get pilgrimage packages by pilgrimage id */
  async fetchByPilgrimage(query: {
    pilgrimageId: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const filter: any = {
        pilgrimage: new mongoose.Types.ObjectId(query.pilgrimageId),
      };

      if (query.search) {
        const regex = new RegExp(query.search, 'i');
        filter.$or = [{ name: regex }];
      }

      const modelQuery = this.pilgrimagePackageModel
        .find(filter)
        .populate('pilgrimage')
        .sort({ createdAt: -1 });

      const pagination = await paginate(modelQuery, query.page, query.limit);

      return {
        pilgrimagePackages: pagination.data,
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
