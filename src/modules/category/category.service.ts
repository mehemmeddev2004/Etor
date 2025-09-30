import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { CategoryEntity } from "src/database/Category.entity";
import { DataSource, IsNull, Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { FilterCategoryDto } from "./dto/filter-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ClsService } from "nestjs-cls";
import { userEntity } from "src/database/user.entity";
import { ProductEntity } from "src/database/Product.entity";
import { ProductSpec } from "src/database/Product-Spec.entity";
import { ProductSpecValue } from "src/database/Product-spec-value.entity";
import { ProductVariant } from "src/database/Product-variant.entity";
import { ProductVariantSpec } from "src/database/product-variant-spec.entity";

@Injectable()
export class CategoryService {
    private categoryRepo: Repository<CategoryEntity>;
    private productRepo: Repository<ProductEntity>;
    private productspecRepo: Repository<ProductSpec>;
    private productSpecValueRepo: Repository<ProductSpecValue>;
    private productVariantRepo: Repository<ProductVariant>;
    private productVariantSpecRepo: Repository<ProductVariantSpec>;

    constructor(

        private readonly cls: ClsService,
        @InjectDataSource() private readonly dataSource: DataSource
    ) {
        this.productspecRepo = this.dataSource.getRepository(ProductSpec);
        this.productSpecValueRepo = this.dataSource.getRepository(ProductSpecValue);
        this.productVariantRepo = this.dataSource.getRepository(ProductVariant);
        this.productVariantSpecRepo = this.dataSource.getRepository(ProductVariantSpec);
        this.categoryRepo = this.dataSource.getRepository(CategoryEntity);
    }

 async find() {
    const result = await this.categoryRepo.find({
        where: { parentId: IsNull() },
        relations: [
            'children',
            'parent',
            'products',
            'products.variants',
            'products.specs',
            'products.specs.values',
            'products.variants.specs'
        ],
    });

    return result;
}


    async findById(id: number) {
        const result = await this.categoryRepo.findOne({
            where: { id },
            relations: ['children', 'parent'],
        });
        if (!result) throw new NotFoundException(`Category with id ${id} not found`);
        return result;
    }

    async create(params: CreateCategoryDto) {
        const user = this.cls.get<userEntity>('user');
        if (!user) throw new NotFoundException("User is not found");

        let parentCategory: CategoryEntity | null = null;

        if (params.parentId) {
            parentCategory = await this.categoryRepo.findOne({
                where: { id: params.parentId },
            });

            if (!parentCategory) {
                throw new NotFoundException('Parent category is not found');
            }
        }

        const existing = await this.categoryRepo.findOne({ where: { slug: params.slug } });
        if (existing) {
            throw new BadRequestException(`Category with slug "${params.slug}" already exists`);
        }




        const category = this.categoryRepo.create({
            name: params.name,
            slug: params.slug,
            parent: parentCategory,
        });

        await this.categoryRepo.save(category);

        return category;
    }

    async filter(params: FilterCategoryDto) {
        try {
            const query = this.categoryRepo.createQueryBuilder('category')
                .leftJoinAndSelect('category.children', 'children')
                .leftJoinAndSelect('category.parent', 'parent');

            if (params.name) {
                query.andWhere('LOWER(category.name) LIKE LOWER(:name)', { name: `%${params.name}%` });
            }

            if (params.slug) {
                query.andWhere('LOWER(category.slug) LIKE LOWER(:slug)', { slug: `%${params.slug}%` });
            }

            if (params.parentId !== undefined && params.parentId !== null) {
                const parentId = Number(params.parentId);
                if (!isNaN(parentId)) {
                    query.andWhere('category.parentId = :parentId', { parentId });
                }
            }

            const result = await query.getMany();

            return {
                data: result,
                message: "Filtered categories retrieved successfully",
            };

        } catch (err) {
            throw new BadRequestException('Failed to filter categories', err.message || err);
        }
    }

    async update(params: UpdateCategoryDto, id: number) {
        const user = this.cls.get<userEntity>('user');
        if (!user) throw new NotFoundException("User is not found");

        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category) throw new NotFoundException(`Category with id ${id} not found`);

        await this.categoryRepo.update(id, params);

        const updatedCategory = await this.categoryRepo.findOne({
            where: { id },
            relations: ['children', 'parent'],
        });

        return updatedCategory;
    }

    async delete(id: number) {
        const user = this.cls.get<userEntity>('user');
        if (!user) throw new NotFoundException("User is not found");

        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category) throw new NotFoundException(`Category with id ${id} not found`);

        await this.categoryRepo.delete(id);

        return { message: `Category with id ${id} deleted successfully` };
    }
}
