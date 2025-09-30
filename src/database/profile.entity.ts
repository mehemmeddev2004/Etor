import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
// Removed circular import - using string reference instead
// Circular dependency fix - use string reference instead of direct import

@Entity('Profiles')
export class ProfileEntiry{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable: true})
    img: string

    @Column({nullable: true})
    name: string

     @OneToOne('userEntity', (user: any) => user.profile, {onDelete: 'CASCADE'})
    user: any

}