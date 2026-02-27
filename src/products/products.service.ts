import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>
  ) { }

  async create(createProductDto: CreateProductDto) {

    try {

      const { images = [], ...productDetails } = createProductDto

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      });

      await this.productRepository.save(product);

      return product;

    } catch (error: any) {
      this.handleException(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto
    const products = this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });

    return (await products).map(product => ({
      ...product,
      images: product.images?.map(img => img.url)
    }))
  }

  async findOne(id: string) {

    const product = await this.productRepository.findOneBy({ id });

    if (!product) throw new NotFoundException();

    return {
      ...product,
      images: product.images?.map(img => img.url) ?? []
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    try {

      const { images, ...toUpdate } = updateProductDto;

      const product = await this.productRepository.preload({
        id,
        ...toUpdate
      });

      if (!product)
        throw new NotFoundException(`Producto con el id: ${id} no fue encontrado`);

      // Si vienen imágenes nuevas
      if (images) {

        // Borra imágenes anteriores
        await this.productImageRepository.delete({ product: { id } });

        // Asigna nuevas imágenes
        product.images = images.map(image =>
          this.productImageRepository.create({ url: image })
        );
      }

      await this.productRepository.save(product);

      return product;

    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const result = this.productRepository.delete(id);

    if ((await result).affected === 0) {
      throw new NotFoundException(`El producto con el id: ${id} no fue encontrado en la base de datos`)
    }

    return { message: `Producto eliminado correctamente` }
  }

  async removeByName(title: string) {
    const result = this.productRepository.delete({ title });

    if ((await result).affected === 0) {
      throw new NotFoundException(`El producto con el titulo: ${title} no fue encontrado en la base de datos`)
    }

    return { message: `Producto eliminado correctamente` }
  }

  private handleException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail)
    this.logger.error(error)
    throw new InternalServerErrorException('Ocurrio un error inesperado')
  }

  async deleleAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
    } catch (error) { this.handleException(error) }
  }

}
