import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ApiBearerAuth, ApiConsumes, ApiBody, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "src/guard/auth.guard";
import { UpsertProductVariantDto } from "./dto/upsert-product-variant.dto";
import { UpsertProductSpecDto } from "./dto/upsert-product-spec.dto";

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    async findAll(

    ) {
        return this.productService.find();
    }

    @Get('filter')
    async filter(
        @Query('name') name?: string,
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number,
        @Query('categoryId') categoryId?: number,
        @Query('sortBy') sortBy?: 'name' | 'price' | 'createdAt',
        @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.productService.filter({ name, minPrice, maxPrice, categoryId, sortBy, sortOrder, page, limit });
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findById(id);
    }

    @Post('category/:categoryId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async create(
        @Body() createProductDto: CreateProductDto,
        @Param('categoryId', ParseIntPipe) categoryId: number
    ) {
        return this.productService.create(createProductDto, categoryId);
    }

    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async update(
        @Body() updateProductDto: UpdateProductDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.productService.update(updateProductDto, id);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.productService.delete(id);
    }


    @Post(':productId/specs')
    async upsertProductSpec(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() params: UpsertProductSpecDto
    ) {
        return this.productService.upsertProductSpecDto(params, productId);
    }

 
    @Delete('specs/:specId')
    async deleteProductSpec(
        @Param('specId', ParseIntPipe) specId: number
    ) {
        return this.productService.deleteProductSpec(specId);
    }

    @Post(':productId/variants')
    async upsertProductVariant(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() params: UpsertProductVariantDto
    ) {
        return this.productService.upsertProductVariant(params, productId);
    }

    @Post(':productId/upload-image')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Upload single image for product' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor('image', {
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
            fileFilter: (req, file, callback) => {
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                if (allowedTypes.includes(file.mimetype)) {
                    callback(null, true);
                } else {
                    callback(new BadRequestException('Only image files are allowed'), false);
                }
            },
        })
    )
    async uploadProductImage(
        @Param('productId', ParseIntPipe) productId: number,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (!file) {
            throw new BadRequestException('No image file provided');
        }
        return this.productService.uploadProductImage(productId, file);
    }

    @Post(':productId/upload-images')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Upload multiple images for product' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB per file
            },
            fileFilter: (req, file, callback) => {
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                if (allowedTypes.includes(file.mimetype)) {
                    callback(null, true);
                } else {
                    callback(new BadRequestException('Only image files are allowed'), false);
                }
            },
        })
    )
    async uploadProductImages(
        @Param('productId', ParseIntPipe) productId: number,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No image files provided');
        }
        return this.productService.uploadProductImages(productId, files);
    }

    @Delete(':productId/images/:imageIndex')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Delete product image by index' })
    async deleteProductImage(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('imageIndex', ParseIntPipe) imageIndex: number
    ) {
        return this.productService.deleteProductImage(productId, imageIndex);
    }


}
