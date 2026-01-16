import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductPackageService } from 'src/product-package/product-package.service';
import {
  ProductPackage,
  ProductPackageSchema,
} from 'src/product-package/schemas/product-package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductPackage.name, schema: ProductPackageSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryService, ProductPackageService],
})
export class ProductModule {}
