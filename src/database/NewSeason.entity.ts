import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "./Product.entity";
import { SeasonType } from "src/shared/enum/Seasson.enum";

@Entity('new_season')
export class NewSeasonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // məsələn: "2025 Yay kolleksiyası"

  @Column({
    type: "enum",
    enum: SeasonType,
  })
  seasonType: SeasonType;

  @OneToOne(() => ProductEntity, (product) => product.newSeason)
  product: ProductEntity;
}