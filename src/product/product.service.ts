import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { paginate } from 'src/utils/utils';
import { Product, ProductDocument } from './schemas/product.schema';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductPackageDto } from 'src/product-package/dto/product-package.dto';
import { ProductPackageService } from 'src/product-package/product-package.service';
import { UpdateProductPackageDto } from 'src/product-package/dto/update-product-package.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly productPackageService: ProductPackageService,
  ) {}

  private async uploadUserImage(file: Express.Multer.File | undefined) {
    try {
      if (!file) {
        return null;
      }
      const uploadedFile = await this.cloudinaryService.uploadFile(
        file,
        'product-image',
      );

      return uploadedFile.secure_url;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  //create product
  async create(productDto: ProductDto, files?: any) {
    try {
      let image: string | undefined;

      if (files?.image?.[0]) {
        image = await this.uploadUserImage(files.image[0]);
      }

      const updateProduct = {
        ...productDto,
        ...(image && { image }),
      };
      const product = await this.productModel.create(updateProduct);

      return product;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  /**get product list */
  async fetch(query: {
    productId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      let filter: any = {};
      if (query.productId) {
        filter._id = new mongoose.Types.ObjectId(query.productId);
      }

      if (query.search) {
        const regex = new RegExp(query.search, 'i');
        filter.$or = [{ name: regex }];
      }

      const modelQuery = this.productModel.find(filter).sort({ createdAt: -1 });
      const pagination = await paginate(modelQuery, query.page, query.limit);

      return {
        product: pagination.data,
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

  async update(id: string, updateProductDto: UpdateProductDto, files?: any) {
    try {
      let image: string | undefined;

      if (files?.image?.[0]) {
        image = await this.uploadUserImage(files.image[0]);
      }

      const updateData = {
        ...updateProductDto,
        ...(image && { image }),
      };

      const product = await this.productModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        updateData,
        { new: true, runValidators: true },
      );

      if (!product) throw new BadRequestException('Invalid product id');

      return product;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /**  //post  package */
  async createPackage(productPackageDto: ProductPackageDto) {
    try {
      const productPackage = await this.productPackageService.create({
        product: productPackageDto.product,
        ...productPackageDto,
      });

      return productPackage;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /**update package */
  async updatePackage(
    id: string,
    updateProductPackageDto: UpdateProductPackageDto,
  ) {
    try {
      const productPackage = await this.productPackageService.update(
        id,
        updateProductPackageDto,
      );

      return productPackage;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }

  /** get  packages by product id*/
  async fetchProductPackages(query: {
    productId: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      return await this.productPackageService.fetchByProduct(query);
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error.message,
        error?.status ?? 500,
      );
    }
  }
}
