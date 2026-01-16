import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { paginate } from 'src/utils/utils';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { Pilgrimage, PilgrimageDocument } from './schemas/pilgrimage.schema';
import { PilgrimageDto } from './dto/pilgrimage.dto';
import { UpdatePilgrimageDto } from './dto/update-pilgrimage.dto';
import { PilgrimagePackageService } from 'src/pilgrimage-package/pilgrimage-package.service';
import { PilgrimagePackageDto } from 'src/pilgrimage-package/dto/pilgrimage-package.dto';

@Injectable()
export class PilgrimageService {
  constructor(
    @InjectModel(Pilgrimage.name)
    private pilgrimageModel: Model<PilgrimageDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly pilgrimagePackageService: PilgrimagePackageService,
  ) {}

  private async uploadUserImage(file: Express.Multer.File | undefined) {
    try {
      if (!file) {
        return null;
      }
      const uploadedFile = await this.cloudinaryService.uploadFile(
        file,
        'pilgrimage-image',
      );

      return uploadedFile.secure_url;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  //post pilgrimage data
  async create(pilgrimageDto: PilgrimageDto, files?: any) {
    try {
      let image: string | undefined;

      if (files?.image?.[0]) {
        image = await this.uploadUserImage(files.image[0]);
      }

      const updatePilgrimage = {
        ...pilgrimageDto,
        ...(image && { image }),
      };
      const pilgrimage = await this.pilgrimageModel.create(updatePilgrimage);

      return pilgrimage;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  /**get pilgrimage  list */
  async fetchPilgrimage(query: {
    pilgrimageId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      let filter: any = {};
      if (query.pilgrimageId) {
        filter._id = new mongoose.Types.ObjectId(query.pilgrimageId);
      }

      if (query.search) {
        const regex = new RegExp(query.search, 'i');
        filter.$or = [{ name: regex }];
      }

      const modelQuery = this.pilgrimageModel
        .find(filter)
        .sort({ createdAt: -1 });
      const pagination = await paginate(modelQuery, query.page, query.limit);

      return {
        pilgrimages: pagination.data,
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

  async update(
    id: string,
    updatePilgrimageDto: UpdatePilgrimageDto,
    files?: any,
  ) {
    try {
      let image: string | undefined;

      if (files?.image?.[0]) {
        image = await this.uploadUserImage(files.image[0]);
      }

      const updateData = {
        ...updatePilgrimageDto,
        ...(image && { image }),
      };

      const hotel = await this.pilgrimageModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        updateData,
        { new: true, runValidators: true },
      );

      if (!hotel) throw new BadRequestException('Invalid hotel id');

      return hotel;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /**  //post pilgrimage package */
  async createPilgrimagePackage(pilgrimagePackageDto: PilgrimagePackageDto) {
    try {
      console.log('pilgrimagePackageDto', pilgrimagePackageDto);
      const pilgrimagePackage = await this.pilgrimagePackageService.create({
        pilgrimage: pilgrimagePackageDto.pilgrimage,
        ...pilgrimagePackageDto,
      });

      return pilgrimagePackage;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /**update pilgriamge package */
  async updatePilgriamgePackage(
    id: string,
    updatePilgrimageDto: UpdatePilgrimageDto,
  ) {
    try {
      const pilgrimage = await this.pilgrimagePackageService.update(
        id,
        updatePilgrimageDto,
      );

      return pilgrimage;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /** get pilgrimage packages by tour */
  async fetchPilgrimagePackages(query: {
    pilgrimageId: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      return await this.pilgrimagePackageService.fetchByPilgrimage(query);
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }
}
