import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtraProduct } from './entities/extra-product.entity';
import { CreateExtraProductDto } from './dto/create-extra-product.dto';
import { UpdateExtraProductDto } from './dto/update-extra-product.dto';

@Injectable()
export class ExtraProductService {
  constructor(@InjectRepository(ExtraProduct) private readonly extraProductRepository: Repository<ExtraProduct>) {}

  async create(createExtraProductDto: CreateExtraProductDto): Promise<ExtraProduct> {
    const extraProduct = this.extraProductRepository.create(createExtraProductDto);
    return await this.extraProductRepository.save(extraProduct);
  }

  async findAll(): Promise<ExtraProduct[]> {
    return await this.extraProductRepository.find();
  }

  async findOne(id: string): Promise<ExtraProduct> {
    const extraProduct = await this.extraProductRepository.findOne({ where: { id } });
    if (!extraProduct) {
      throw new NotFoundException(`Extra product with ID ${id} not found`);
    }
    return extraProduct;
  }

  async update(id: string, updateExtraProductDto: UpdateExtraProductDto): Promise<ExtraProduct> {
    const extraProduct = await this.findOne(id);
    Object.assign(extraProduct, updateExtraProductDto);
    return await this.extraProductRepository.save(extraProduct);
  }

  async remove(id: string): Promise<void> {
    const result = await this.extraProductRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Extra product with ID ${id} not found`);
    }
  }
} 