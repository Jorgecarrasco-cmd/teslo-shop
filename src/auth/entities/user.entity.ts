import { Product } from 'src/products/entities/product.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ type: 'text', unique: true })
    email!: string

    @Column({ type: 'text', select: false })
    password!: string

    @Column('text')
    fullName!: string

    @Column({ type: 'bool', default: true })
    isActive!: boolean

    @Column({ array: true, type: 'text', default: ['user'] })
    roles!: string[];

    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product?: Product;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert()
    }
}


