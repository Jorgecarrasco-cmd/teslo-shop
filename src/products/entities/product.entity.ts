import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";

@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn('uuid')
    
    id!: string

    @Column({ type: 'text', unique: true })
    
    title!: string

    @Column({ unique: true, type: 'text' })
    
    slug!: string

    @Column({
        type: "float", default: 0
    })
    
    price!: number

    @Column({
        default: 0,
    })
    
    stock!: number

    @Column({ type: 'text', array: true })
    
    sizes!: string[]

    @Column({ type: 'text' })
    
    gender!: string

    //nullables
    @Column({
        type: 'text', nullable: true, unique: true,
    })
    
    description?: string

    //tags
    @Column({ type: 'text', array: true, default: [] })
    
    tags!: string[]

    //relaciones
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    
    images?: ProductImage[]

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    
    user?: User

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll("'", '')
        }
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLocaleLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }
}
