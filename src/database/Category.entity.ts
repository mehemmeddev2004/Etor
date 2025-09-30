import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
// Removed circular import - using string reference instead


@Entity('Category')
export class CategoryEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    slug: string


    @Column({ nullable: true })
    parentId: number | null

    @Column({ nullable: true })
    imageUrl: string

    @OneToMany('ProductEntity', (product: any) => product.category)
    products: any[]

    @ManyToOne(
        () => CategoryEntity,
        (category) => category.children,
        {
            nullable: true,
            onDelete: "CASCADE",
        },
    )
    @JoinColumn({ name: "parentId" })
    parent: CategoryEntity | null 


    @OneToMany(
        () => CategoryEntity,
        (category) => category.parent,
    )
    children: CategoryEntity[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}