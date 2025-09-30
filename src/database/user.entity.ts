import { UserProvider, UserRole } from "src/shared/enum/user.enum";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
// Circular dependency fix - use string reference instead of direct import
// Removed circular imports - using string references instead
// Removed circular import - using string reference instead


@Entity('user')
export class userEntity {
    @PrimaryGeneratedColumn()
    id: number


    @Column()
    password: string

   
    @Column({ nullable: true })
    username: string

    @Column()
    email: string

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.ADMIN,
    })
    role: UserRole;

    @Column({ nullable: true })
    providerId: string;

    @OneToOne('ProfileEntiry', (profile: any) => profile.user, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    profile: any

    @OneToMany('ProductEntity', (product: any) => product.user)
    products: any


    @Column({
        type: 'enum',
        enum: UserProvider,
        default: UserProvider.LOCAL,
    })
    provider: UserProvider;

    @OneToMany('PaymentEntity', (payment: any) => payment.user)
    payments: any[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async beforeUpsert() {
        if (!this.password) return;

        this.password = await bcrypt.hash(this.password, 10);
    }
}
