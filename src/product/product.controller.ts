import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseInterceptors,
  Get,
  UploadedFiles,
  Query,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { successResponse } from 'src/core/config/response';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductPackageDto } from 'src/product-package/dto/product-package.dto';
import { UpdateProductPackageDto } from 'src/product-package/dto/update-product-package.dto';
import { JwtAuthGuard } from 'src/core/guard/jwt/jwt-auth.guard';
import { AdminAuthGuard } from 'src/core/guard/admin-jwt/jwt-auth.guard';

@Controller('api/v1/product')
@ApiTags('This section is for PRODUCT CRUD')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Post('/admin')
  @ApiOperation({
    summary: 'This is to add or create product data',
    description: `Create product`,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Egypt Explorer',
          description: 'Product name',
          nullable: false,
        },
        about: {
          type: 'string',
          example:
            'Embark on unforgettable journeys with our carefully crafted product packages. From cultural explorations to luxury getaways, we create memories that last a lifeti',
          description: 'about or description of product',
          nullable: false,
        },
        benefits: {
          type: 'array',
          items: { type: 'string' },
          example: ['Hot air balloon ride', 'Hagia Sophia'],
          description: 'This is the list of benefit for the product',
          nullable: false,
        },
        duration: {
          type: 'number',
          example: 7,
          description: 'duration, this is optional',
          nullable: true,
        },
        price: {
          type: 'number',
          example: 34684,
          description: 'price of product',
          nullable: true,
        },
        discountPrice: {
          type: 'number',
          example: 7,
          description: `discount price of product, it's optional`,
          nullable: true,
        },
        location: {
          type: 'string',
          example: 'Cairo, Luxor, Aswan',
          description: `This is the locations for the product, it's optional`,
          nullable: true,
        },
        rating: {
          type: 'number',
          example: 4.7,
          description: 'Rating between 0 and 5',
          nullable: true,
        },
        image: { type: 'string', format: 'binary', nullable: true },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @ApiResponse({ status: 200, description: 'Product created' })
  @ApiResponse({ status: 401, description: 'Error performing task' })
  async create(
    @Body() productDto: ProductDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    const data = await this.productService.create(productDto, files);
    return successResponse({
      message: 'Product created',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Get('/admin')
  @ApiOperation({
    summary:
      'Get product details by Admin with optional search, filter, and pagination',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
    description: 'Number of items per page (default: 20)',
  })
  @ApiQuery({
    name: 'productId',
    required: false,
    type: String,
    example: '624f048d886a86063a88f1d2',
    description: 'This should be mongo id',
  })
  @ApiResponse({ status: 200, description: 'Product details retrieved' })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async fetchByAdmin(
    @Query('search') search?: string,
    @Query('productId') productId?: string,
    @Query('page')
    page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    const data = await this.productService.fetch({
      productId,
      search,
      page,
      limit,
    });

    return {
      message: 'product details retrieved',
      code: HttpStatus.OK,
      status: 'success',
      ...data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get product details with optional search, filter, and pagination',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
    description: 'Number of items per page (default: 20)',
  })
  @ApiQuery({
    name: 'productId',
    required: false,
    type: String,
    example: '624f048d886a86063a88f1d2',
    description: 'This should be mongo id',
  })
  @ApiResponse({ status: 200, description: 'Product details retrieved' })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async fetch(
    @Query('search') search?: string,
    @Query('productId') productId?: string,
    @Query('page')
    page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    const data = await this.productService.fetch({
      productId,
      search,
      page,
      limit,
    });

    return {
      message: 'product details retrieved',
      code: HttpStatus.OK,
      status: 'success',
      ...data,
    };
  }

  //update product controller
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Put('/admin')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update product details' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Egypt Explorer',
          description: 'Product name',
          nullable: true,
        },
        about: {
          type: 'string',
          example:
            'Embark on unforgettable journeys with our carefully crafted product packages. From cultural explorations to luxury getaways, we create memories that last a lifeti',
          description: 'about or description of product',
          nullable: true,
        },
        duration: {
          type: 'number',
          example: 7,
          description: 'duration, this is optional',
          nullable: true,
        },
        price: {
          type: 'number',
          example: 34684,
          description: 'price of product',
          nullable: true,
        },
        discountPrice: {
          type: 'number',
          example: 7,
          description: `discount price of product, it's optional`,
          nullable: true,
        },
        location: {
          type: 'string',
          example: 'Cairo, Luxor, Aswan',
          description: `This is the locations for the product, it's optional`,
          nullable: true,
        },

        benefits: {
          type: 'array',
          items: { type: 'string' },
          example: ['Hot air balloon ride', 'Hagia Sophia'],
          description: 'This is the list of benefit for the product',
          nullable: true,
        },
        rating: {
          type: 'number',
          example: 4.7,
          description: 'Rating between 0 and 5',
          nullable: true,
        },
        image: { type: 'string', format: 'binary', nullable: true },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @ApiResponse({ status: 200, description: 'Update successful' })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async updateproduct(
    @Query('id') id: string,
    @Body()
    updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    const data = await this.productService.update(id, updateProductDto, files);
    return {
      message: 'Update successful',
      code: HttpStatus.OK,
      status: 'success',
      data,
    };
  }

  /**product package */
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Post('package/admin')
  @ApiOperation({
    summary: 'Add product package details',
    description: ``,
  })
  @ApiBody({ type: ProductPackageDto })
  @ApiResponse({ status: 200, description: 'Product Package details created' })
  @ApiResponse({ status: 401, description: 'Error performing task' })
  async productPackage(@Body() productPackageDto: ProductPackageDto) {
    const data = await this.productService.createPackage(productPackageDto);
    return successResponse({
      message: 'Product package details created',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Put('package/:id/admin')
  @ApiOperation({
    summary: 'update product package',
    description: `All Payload are optional`,
  })
  @ApiBody({ type: UpdateProductPackageDto })
  @ApiResponse({ status: 200, description: 'Product Package details updated' })
  @ApiResponse({ status: 401, description: 'Error performing task' })
  async packageUpdate(
    @Param('id') id: string,
    @Body() updateProductPackageDto: UpdateProductPackageDto,
  ) {
    const data = await this.productService.updatePackage(
      id,
      updateProductPackageDto,
    );
    return successResponse({
      message: 'Product Package details updated',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('package')
  @ApiOperation({
    summary:
      'Get product packages by product id with optional search and pagination in the query parameters',
  })
  @ApiQuery({
    name: 'productId',
    required: true,
    type: String,
    description: 'MongoDB id of the product in the query params',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
  })
  @ApiResponse({ status: 200, description: 'product packages retrieved' })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async fetchproductPackages(
    @Query('productId') productId: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const data = await this.productService.fetchProductPackages({
      productId,
      search,
      page,
      limit,
    });

    return {
      message: 'product packages retrieved',
      code: HttpStatus.OK,
      status: 'success',
      ...data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Get('package/admin')
  @ApiOperation({
    summary:
      'Get product packages by product id with optional search and pagination in the query parameters',
  })
  @ApiQuery({
    name: 'productId',
    required: true,
    type: String,
    description: 'MongoDB id of the product in the query params',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
  })
  @ApiResponse({ status: 200, description: 'product packages retrieved' })
  @ApiResponse({ status: 400, description: 'Error performing task' })
  async fetchproductPackagesByAdin(
    @Query('productId') productId: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const data = await this.productService.fetchProductPackages({
      productId,
      search,
      page,
      limit,
    });

    return {
      message: 'product packages retrieved',
      code: HttpStatus.OK,
      status: 'success',
      ...data,
    };
  }
}
