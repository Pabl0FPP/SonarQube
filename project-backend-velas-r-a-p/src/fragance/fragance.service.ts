import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFraganceDto } from './dto/create-fragance.dto';
import { UpdateFraganceDto } from './dto/update-fragance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Fragance } from './entities/fragance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FraganceService {
  constructor(@InjectRepository(Fragance) private readonly repositoryFragance: Repository<Fragance>) {}

  /**
   * Creates a new fragance.
   * @param createFraganceDto Data for the new fragance.
   * @returns The created fragance.
   */
  async create(createFraganceDto: CreateFraganceDto) {
    return await this.repositoryFragance.save(createFraganceDto);
  }

  /**
   * Returns all fragances.
   * @returns Array of fragances.
   */
  findAll() {
    return this.repositoryFragance.find();
  }


  /**
   * Returns a fragance by its ID.
   * @param id Fragance UUID.
   * @throws NotFoundException if fragance is not found.
   * @returns The fragance.
   */

  async findOne(id: string) {
    const fragance = await this.repositoryFragance.findOneBy({ id });
    if (!fragance) {
      throw new NotFoundException(`Fragance with ID ${id} not found`);
    }
    return fragance;

  }

  /**
   * Updates a fragance by its ID.
   * @param id Fragance UUID.
   * @param updateFraganceDto Data to update.
   * @throws NotFoundException if fragance is not found.
   * @returns The updated fragance.
   */
  async update(id: string, updateFraganceDto: UpdateFraganceDto) {
    const result = await this.repositoryFragance.update(id, updateFraganceDto);
    if (!result.affected) {
      throw new NotFoundException(`Fragance with ID ${id} not found`);
    }
    return this.findOne(id);
  }

  /**
   * Deletes a fragance by its ID.
   * @param id Fragance UUID.
   * @returns The deleted fragance.
   */
  remove(id: string) {
    const fraganceDelete = this.findOne(id);
    this.repositoryFragance.delete(id);
    return fraganceDelete
  }
}
