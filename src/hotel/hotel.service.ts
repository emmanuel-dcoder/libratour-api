import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { paginate } from 'src/utils/utils';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { HotelDto } from './dto/hotel.dto';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { HotelPackageDto } from 'src/hotel-package/dto/hotel-package.dto';
import { HotelPackageService } from 'src/hotel-package/hotel-package.service';
import { UpdateHotelPackageDto } from 'src/hotel-package/dto/update-hotel-package.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly hotelPackageService: HotelPackageService,
  ) {}

  private async uploadUserImage(file: Express.Multer.File | undefined) {
    try {
      if (!file) {
        return null;
      }
      const uploadedFile = await this.cloudinaryService.uploadFile(
        file,
        'hotel-image',
      );

      return uploadedFile.secure_url;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  //create hotel
  async create(hotelDto: HotelDto, files?: any) {
    try {
      let image: string | undefined;

      if (files?.image?.[0]) {
        image = await this.uploadUserImage(files.image[0]);
      }

      const updateHotel = {
        ...hotelDto,
        ...(image && { image }),
      };
      const hotel = await this.hotelModel.create(updateHotel);

      return hotel;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  /**get hotel list */
  async fetchHotel(query: {
    hotelId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      let filter: any = {};
      if (query.hotelId) {
        filter._id = new mongoose.Types.ObjectId(query.hotelId);
      }

      if (query.search) {
        const regex = new RegExp(query.search, 'i');
        filter.$or = [{ name: regex }];
      }

      const modelQuery = this.hotelModel.find(filter).sort({ createdAt: -1 });
      const pagination = await paginate(modelQuery, query.page, query.limit);

      return {
        hotel: pagination.data,
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

  async update(id: string, updateHotelDto: UpdateHotelDto, files?: any) {
    try {
      let image: string | undefined;

      if (files?.image?.[0]) {
        image = await this.uploadUserImage(files.image[0]);
      }

      const updateData = {
        ...updateHotelDto,
        ...(image && { image }),
      };

      const hotel = await this.hotelModel.findOneAndUpdate(
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

  /**  //post tour package */
  async createHotelPackage(hotelPackageDto: HotelPackageDto) {
    try {
      const hotelPackage = await this.hotelPackageService.create({
        hotel: hotelPackageDto.hotel,
        ...hotelPackageDto,
      });

      return hotelPackage;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /**update tour package */
  async updateHotelPackage(
    id: string,
    updateHotelPackageDto: UpdateHotelPackageDto,
  ) {
    try {
      const hotelPackage = await this.hotelPackageService.update(
        id,
        updateHotelPackageDto,
      );

      return hotelPackage;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /** get hotel packages by tour */
  async fetchHotelPackages(query: {
    hotelId: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      return await this.hotelPackageService.fetchByHotel(query);
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }
}
