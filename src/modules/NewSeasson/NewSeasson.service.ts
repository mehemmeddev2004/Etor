import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

import { ProductEntity } from "src/database/Product.entity";
import { NewSeasonEntity, } from "src/database/NewSeason.entity";
import { CreateNewSeassonDto } from "./dto/Create.NewSeasson.dto";
import { UpdateNewSeassonDto } from "./dto/Update.NewSeasson.dto";
import { SeasonType } from "src/shared/enum/Seasson.enum";


@Injectable()
export class NewSeasonService {
  private readonly logger = new Logger(NewSeasonService.name);
  private newSeasonRepo: Repository<NewSeasonEntity>;
  private productRepo: Repository<ProductEntity>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.newSeasonRepo = this.dataSource.getRepository(NewSeasonEntity);
    this.productRepo = this.dataSource.getRepository(ProductEntity);
  }

  async find() {
    return this.newSeasonRepo.find({ relations: ["product"] });
  }

  async findById(id: number) {
    const season = await this.newSeasonRepo.findOne({
      where: { id },
      relations: ["product"],
    });
    if (!season) throw new NotFoundException("New season not found");
    return season;
  }

  async findBySeason(season: SeasonType) {
    return this.newSeasonRepo.find({
      where: { seasonType: season },
      relations: ["product"],
    });
  }

  async findCurrentSeason() {
    const month = new Date().getMonth() + 1; 
    let season: SeasonType;

    if ([3, 4, 5].includes(month)) season = SeasonType.SPRING;
    else if ([6, 7, 8].includes(month)) season = SeasonType.SUMMER;
    else if ([9, 10, 11].includes(month)) season = SeasonType.AUTUMN;
    else season = SeasonType.WINTER;

    return this.findBySeason(season);
  }

  async create(params: CreateNewSeassonDto, productId: number) {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException("Product ID not found");
    }

    const newSeason = this.newSeasonRepo.create({
      ...params,
      product,
    });
    await this.newSeasonRepo.save(newSeason);

    return {
      message: "New season created successfully",
      newSeason,
    };
  }

  async update(params: UpdateNewSeassonDto, id: number) {
    const season = await this.newSeasonRepo.findOne({ where: { id } });
    if (!season) throw new NotFoundException("New season not found");

    await this.newSeasonRepo.update(id, params);

    return {
      message: "New season updated successfully",
      id,
    };
  }

  async remove(id: number) {
    const season = await this.newSeasonRepo.findOne({ 
      where: { id },
      relations: ["product"]
    });
    if (!season) throw new NotFoundException("New season not found");

    try {
      this.logger.log(`Attempting to delete NewSeason with ID: ${id}`);
      
      // First, remove the foreign key reference from any products that reference this season
      const updateResult = await this.productRepo
        .createQueryBuilder()
        .update(ProductEntity)
        .set({ newSeason: () => "NULL" })
        .where("newSeasonId = :seasonId", { seasonId: id })
        .execute();

      this.logger.log(`Updated ${updateResult.affected} products to remove NewSeason reference`);

      // Now safely remove the season
      await this.newSeasonRepo.remove(season);
      
      this.logger.log(`Successfully deleted NewSeason with ID: ${id}`);

      return {
        message: "New season deleted successfully",
        id,
      };
    } catch (error) {
      this.logger.error(`Failed to delete NewSeason with ID: ${id}`, error.stack);
      throw error;
    }
  }
}
