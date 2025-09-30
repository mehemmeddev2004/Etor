import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { userEntity } from "./user.entity";

@Entity('Profiles')
export class ProfileEntiry{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable: true})
    img: string

    @Column({nullable: true})
    name: string

     @OneToOne(() => userEntity, (user) => user.profile, {onDelete: 'CASCADE'})
    user: userEntity

}