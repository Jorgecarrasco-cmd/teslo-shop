import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService
  ) {
  }

  async runSeed() {
    await this.insertProducts()
    return 'Seed ejecutada'
  }

  private async insertProducts() {

    await this.productService.deleleAllProducts()

    const seedProducts = initialData.products

    const insertPromises = seedProducts.map(product =>
      this.productService.create(product)
    )

    await Promise.all(insertPromises)

    return true
  }
}
