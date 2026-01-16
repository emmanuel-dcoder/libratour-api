import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { paginate } from 'src/utils/utils';
import mongoose, { Model } from 'mongoose';
import {
  ProductPackage,
  ProductPackageDocument,
} from './schemas/product-package.schema';
import { ProductPackageDto } from './dto/product-package.dto';
import { UpdateProductPackageDto } from './dto/update-product-package.dto';

@Injectable()
export class ProductPackageService {
  constructor(
    @InjectModel(ProductPackage.name)
    private productPackageModel: Model<ProductPackageDocument>,
  ) {}

  async create(productPackageDto: ProductPackageDto) {
    try {
      const product = await this.productPackageModel.create(productPackageDto);
      return product;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async update(id: string, updateProductPackageDto: UpdateProductPackageDto) {
    try {
      const product = await this.productPackageModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { ...updateProductPackageDto },
        { new: true, runValidators: true },
      );

      if (!product) throw new BadRequestException('Invalid product package id');

      return product;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /**get product list */
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

      const modelQuery = this.productPackageModel
        .find(filter)
        .populate('product')
        .sort({ createdAt: -1 });
      const pagination = await paginate(modelQuery, query.page, query.limit);

      return {
        productPackages: pagination.data,
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

  /** get product packages by product id */
  async fetchByProduct(query: {
    productId: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const filter: any = {
        product: new mongoose.Types.ObjectId(query.productId),
      };

      if (query.search) {
        const regex = new RegExp(query.search, 'i');
        filter.$or = [{ name: regex }];
      }

      const modelQuery = this.productPackageModel
        .find(filter)
        .populate('product')
        .sort({ createdAt: -1 });

      const pagination = await paginate(modelQuery, query.page, query.limit);

      return {
        productPackages: pagination.data,
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
