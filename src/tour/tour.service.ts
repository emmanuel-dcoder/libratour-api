import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTourDto } from './dto/tour.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tour, TourDocument } from './schemas/tour.schema';
import mongoose, { Model } from 'mongoose';
import { MailService } from 'src/core/mail/email';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { NotificationService } from 'src/notification/services/notification.service';
import { paginate } from 'src/utils/utils';
import { UpdateTourDto } from './dto/update-tour.dto';
import { TourPackageService } from 'src/tour-package/tour-package.service';
import { CreateTourPackageDto } from 'src/tour-package/dto/tour-package.dto';
import { UpdateTourPackageDto } from 'src/tour-package/dto/update-tour-package.dto';

@Injectable()
export class TourService {
  constructor(
    @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mailService: MailService,
    private notificationService: NotificationService,
    private readonly tourPackageService: TourPackageService,
  ) {}

  private async uploadUserImage(file: Express.Multer.File | undefined) {
    try {
      if (!file) {
        return null;
      }
      const uploadedFile = await this.cloudinaryService.uploadFile(
        file,
        'tour-image',
      );

      return uploadedFile.secure_url;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  //create tour
  async create(createTourDto: CreateTourDto, files?: any) {
    try {
      let image: string | undefined;

      if (files?.image?.[0]) {
        image = await this.uploadUserImage(files.image[0]);
      }

      const updateTour = {
        ...createTourDto,
        ...(image && { image }),
      };
      const createTour = await this.tourModel.create(updateTour);

      return createTour;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  /**get tour list */
  async fetchTour(query: {
    tourId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      let filter: any = {};
      if (query.tourId) {
        filter._id = new mongoose.Types.ObjectId(query.tourId);
      }

      if (query.search) {
        const regex = new RegExp(query.search, 'i');
        filter.$or = [{ name: regex }];
      }

      const modelQuery = this.tourModel.find(filter).sort({ createdAt: -1 });
      const pagination = await paginate(modelQuery, query.page, query.limit);

      return {
        tour: pagination.data,
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

  async update(id: string, updateTourDto: UpdateTourDto, files?: any) {
    try {
      let image: string | undefined;

      if (files?.image?.[0]) {
        image = await this.uploadUserImage(files.image[0]);
      }

      const updateData = {
        ...updateTourDto,
        ...(image && { image }),
      };

      const tour = await this.tourModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        updateData,
        { new: true, runValidators: true },
      );

      if (!tour) throw new BadRequestException('Invalid tour id');

      return tour;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /**  //post tour package */
  async createTourPackage(createTourPackageDto: CreateTourPackageDto) {
    try {
      const tourPackage = await this.tourPackageService.create({
        tour: createTourPackageDto.tour,
        ...createTourPackageDto,
      });

      return tourPackage;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /**update tour package */
  async updateTourPackage(
    id: string,
    updateTourPackageDto: UpdateTourPackageDto,
  ) {
    try {
      const tourPackage = await this.tourPackageService.update(
        id,
        updateTourPackageDto,
      );

      return tourPackage;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /** get tour packages by tour */
  async fetchTourPackages(query: {
    tourId: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      return await this.tourPackageService.fetchByTour(query);
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }
}
