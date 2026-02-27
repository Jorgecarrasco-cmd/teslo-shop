import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {


  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;

    } catch (error: any) {
      this.handleException(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto
    return this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(id: string) {
    return this.productRepository.findOneBy({ id })
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    try {
      const product = await this.productRepository.preload({
        id: id,
        ...updateProductDto
      });

      if (!product) throw new NotFoundException(`Producto con el id: ${id} no fue encontrado`)

      await this.productRepository.save(product)
      return product;
    } catch (error) {
      this.handleException(error)
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
}
