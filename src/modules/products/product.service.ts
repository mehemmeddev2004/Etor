import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { DataSource, Repository } from "typeorm";

import { CategoryEntity } from "src/database/Category.entity";
import { userEntity } from "src/database/user.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductEntity } from "src/database/Product.entity";
import { ProductSpec } from "src/database/Product-Spec.entity";
import { ProductSpecValue } from "src/database/Product-spec-value.entity";
import { ProductVariant } from "src/database/Product-variant.entity";
import { ProductVariantSpec } from "src/database/product-variant-spec.entity";
import { UpsertProductSpecDto } from "./dto/upsert-product-spec.dto";
import { UpsertProductVariantDto } from "./dto/upsert-product-variant.dto";
import { CloudinaryService } from "src/libs/cloudinary/cloudinary.service";

@Injectable()
export class ProductService {
    private productspecRepo: Repository<ProductSpec>;
    private productSpecValueRepo: Repository<ProductSpecValue>;
    private productVariantRepo: Repository<ProductVariant>
    private productVariantSpecRepo: Repository<ProductVariantSpec>;
    private productRepo: Repository<ProductEntity>;
    private categoryRepo: Repository<CategoryEntity>;

    constructor(
        private readonly cls: ClsService,
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly cloudinaryService: CloudinaryService
    ) {
        this.productRepo = this.dataSource.getRepository(ProductEntity);
        this.categoryRepo = this.dataSource.getRepository(CategoryEntity);
        this.productspecRepo = this.dataSource.getRepository(ProductSpec);
        this.productSpecValueRepo = this.dataSource.getRepository(ProductSpecValue);
        this.categoryRepo = this.dataSource.getRepository(CategoryEntity);
        this.productVariantRepo = this.dataSource.getRepository(ProductVariant);
        this.productVariantSpecRepo = this.dataSource.getRepository(ProductVariantSpec);
    }

    private async checkUser() {
        const user = this.cls.get<userEntity>('user');
        if (!user) throw new NotFoundException("User is not found");
        return user;
    }

    async findCategory(categoryId: number) {
        const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
        if (!category) throw new NotFoundException("Category is not found");
        return category;
    }

    async find() {
        let product = await this.productRepo.find({
            relations: ['category'],
        })
        return product;
    }

    async findById(id: number) {
        await this.checkUser();
        const product = await this.productRepo.findOne({ where: { id }, relations: ['category'] });
        if (!product) throw new NotFoundException("Product not found");
        return product;
    }

    async create(dto: CreateProductDto, categoryId: number) {
        await this.checkUser();
        const category = await this.findCategory(categoryId);

        const product = this.productRepo.create({ ...dto, category });
        await this.productRepo.save(product);

        return { product, message: "Product created" };
    }

    async update(dto: UpdateProductDto, id: number) {
        await this.checkUser();
        const product = await this.productRepo.findOne({ where: { id } });
        if (!product) throw new NotFoundException("Product not found");

        await this.productRepo.update(id, dto);
        const updated = await this.productRepo.findOne({ where: { id }, relations: ['category'] });

        return { product: updated, message: "Product updated" };
    }

    async delete(id: number) {
        await this.checkUser();
        const product = await this.productRepo.findOne({ where: { id } });
        if (!product) throw new NotFoundException("Product not found");

        await this.productRepo.delete(id);
        return { product, message: "Product deleted" };
    }

    async filter(query: {
        name?: string;
        minPrice?: number;
        maxPrice?: number;
        categoryId?: number;
        sortBy?: 'name' | 'price' | 'createdAt';
        sortOrder?: 'ASC' | 'DESC';
        page?: number;
        limit?: number;
    }) {
 
        const qb = this.productRepo.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category');

        if (query.name)
            qb.andWhere('LOWER(product.name) LIKE LOWER(:name)', { name: `%${query.name}%` });

        if (query.minPrice !== undefined)
            qb.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });

        if (query.maxPrice !== undefined)
            qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });

        if (query.categoryId)
            qb.andWhere('category.id = :categoryId', { categoryId: query.categoryId });

        qb.orderBy(`product.${query.sortBy || 'createdAt'}`, query.sortOrder || 'DESC');
        qb.skip(((query.page || 1) - 1) * (query.limit || 10));
        qb.take(query.limit || 10);

        const [data, total] = await qb.getManyAndCount();

        return {
            data,
            total,
            page: query.page || 1,
            limit: query.limit || 10,
            totalPages: Math.ceil(total / (query.limit || 10))
        };
    }

    async upsertProductSpecDto(params: UpsertProductSpecDto, productId: number) {

        const product = await this.productRepo.findOne({ where: { id: productId }, relations: ['specs'] });
        if (!product) throw new NotFoundException(`Product ${productId} is not found`);


        let productSpec = await this.productspecRepo.findOne({ where: { key: params.key, product: { id: productId } }, relations: ['values'] });

        if (!productSpec) {

            productSpec = this.productspecRepo.create({
                key: params.key,
                name: params.name || params.key,
                product: product,
            });
            await this.productspecRepo.save(productSpec);
        }


        if (params.values && params.values.length > 0) {
            await this.productSpecValueRepo.delete({ productSpec: { id: productSpec.id } });

            const specValues = params.values.map(val => {
                return this.productSpecValueRepo.create({
                    ...val,
                    productSpec: productSpec
                });
            });

            await this.productSpecValueRepo.save(specValues);
        }

        return {
            message: 'Product specification upserted successfully',
            productSpec
        };
    }

    async deleteProductSpec(specId: number) {

        const productSpec = await this.productspecRepo.findOne({ where: { id: specId } });
        if (!productSpec) throw new NotFoundException(`Product specification with id ${specId} not found`);


        await this.productspecRepo.delete(specId);

        return {
            message: 'Product specification deleted successfully',
            productSpecId: specId
        };
    }

    async upsertProductVariant(params: UpsertProductVariantDto, id: number) {
        let product = await this.productRepo.findOne({ where: { id } });
        if (!product) throw new NotFoundException("product id is not found");


        let variant = await this.productVariantRepo.findOne({
            where: { slug: params.slug, product: { id } },
            relations: ['specs', 'product'],
        });

        if (variant) {
            variant.stock = params.stock;
            variant.price = params.price;
            variant.discount = params.discount;
            variant.images = params.images;
        } else {
            variant = this.productVariantRepo.create({
                stock: params.stock,
                price: params.price,
                discount: params.discount,
                slug: params.slug,
                images: params.images,
                product: product,
            });
        }


        variant = await this.productVariantRepo.save(variant);


        await this.productVariantSpecRepo.delete({ productVariant: { id: variant.id } });


        if (params.specs && params.specs.length > 0) {
            const specs = params.specs.map(specDto => {
                return this.productVariantSpecRepo.create({
                    key: specDto.key,
                    value: specDto.value,
                    productVariant: variant,
                });
            });
            await this.productVariantSpecRepo.save(specs);
            variant.specs = specs;
        } else {
            variant.specs = [];
        }

        return { variant, message: 'Product variant upserted successfully' };
    }

    async uploadProductImage(productId: number, file: Express.Multer.File) {
        await this.checkUser();
        
        const product = await this.productRepo.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        try {
            const uploadResult = await this.cloudinaryService.uploadImage(file, 'products');
            
            if ('secure_url' in uploadResult && 'public_id' in uploadResult) {
                // If product already has images, add to the array
                const currentImages = product.images || [];
                const currentPublicIds = product.imagePublicIds || [];
                
                currentImages.push(uploadResult.secure_url);
                currentPublicIds.push(uploadResult.public_id);
                
                // Update main img field if it's the first image
                if (!product.img) {
                    product.img = uploadResult.secure_url;
                }
                
                product.images = currentImages;
                product.imagePublicIds = currentPublicIds;
                
                await this.productRepo.save(product);
                
                return {
                    message: 'Image uploaded successfully',
                    imageUrl: uploadResult.secure_url,
                    publicId: uploadResult.public_id,
                    totalImages: currentImages.length
                };
            } else {
                throw new BadRequestException('Upload failed');
            }
        } catch (error) {
            throw new BadRequestException(`Upload failed: ${error.message}`);
        }
    }

    async uploadProductImages(productId: number, files: Express.Multer.File[]) {
        await this.checkUser();
        
        const product = await this.productRepo.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        try {
            const uploadResults = await this.cloudinaryService.uploadMultipleImages(files, 'products');
            
            const currentImages = product.images || [];
            const currentPublicIds = product.imagePublicIds || [];
            const newImages: string[] = [];
            const newPublicIds: string[] = [];
            
            for (const result of uploadResults) {
                if ('secure_url' in result && 'public_id' in result) {
                    newImages.push(result.secure_url);
                    newPublicIds.push(result.public_id);
                    currentImages.push(result.secure_url);
                    currentPublicIds.push(result.public_id);
                }
            }
            
            // Update main img field if it's empty and we have new images
            if (!product.img && newImages.length > 0) {
                product.img = newImages[0];
            }
            
            product.images = currentImages;
            product.imagePublicIds = currentPublicIds;
            
            await this.productRepo.save(product);
            
            return {
                message: `${newImages.length} images uploaded successfully`,
                uploadedImages: newImages,
                uploadedPublicIds: newPublicIds,
                totalImages: currentImages.length
            };
        } catch (error) {
            throw new BadRequestException(`Upload failed: ${error.message}`);
        }
    }

    async deleteProductImage(productId: number, imageIndex: number) {
        await this.checkUser();
        
        const product = await this.productRepo.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const images = product.images || [];
        const publicIds = product.imagePublicIds || [];
        
        if (imageIndex < 0 || imageIndex >= images.length) {
            throw new BadRequestException('Invalid image index');
        }

        try {
            // Delete from Cloudinary
            const publicIdToDelete = publicIds[imageIndex];
            if (publicIdToDelete) {
                await this.cloudinaryService.deleteImage(publicIdToDelete);
            }
            
            // Remove from arrays
            const imageToDelete = images[imageIndex];
            images.splice(imageIndex, 1);
            publicIds.splice(imageIndex, 1);
            
            // Update main img field if we deleted the main image
            if (product.img === imageToDelete) {
                product.img = images.length > 0 ? images[0] : undefined;
            }
            
            product.images = images;
            product.imagePublicIds = publicIds;
            
            await this.productRepo.save(product);
            
            return {
                message: 'Image deleted successfully',
                deletedImageUrl: imageToDelete,
                remainingImages: images.length
            };
        } catch (error) {
            throw new BadRequestException(`Delete failed: ${error.message}`);
        }
    }
}
