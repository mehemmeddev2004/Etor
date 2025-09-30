import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
// Removed circular import - using string reference instead
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

  @OneToOne('ProductEntity', (product: any) => product.newSeason)
  product: any;
}