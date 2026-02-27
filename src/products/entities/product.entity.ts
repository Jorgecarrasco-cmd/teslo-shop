import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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

    @Column({ type: 'text', array: true, default: [] })
    tags!: string[]

    //tags
    //images

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
