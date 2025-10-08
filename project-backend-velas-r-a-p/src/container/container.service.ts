import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Container } from './entities/container.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContainerService {
  constructor(@InjectRepository(Container) private readonly containerRepository: Repository<Container>) {}

  /**
   * Creates a new container.
   * @param createContainerDto Data for the new container.
   * @returns The created container.
   */
  async create(createContainerDto: CreateContainerDto) {
    return await this.containerRepository.save(createContainerDto);
  }

  /**
   * Returns all containers.
   * @returns Array of containers.
   */
  findAll() {
    return this.containerRepository.find();
  }

  /**
   * Returns a container by its ID.
   * @param id Container UUID.
   * @throws NotFoundException if container is not found.
   * @returns The container.
   */
  async findOne(id: string) {
    const container = await this.containerRepository.findOneBy({ id });
    if (container == null) throw new NotFoundException();
    return container;
  }

  /**
   * Updates a container by its ID.
   * @param id Container UUID.
   * @param updateContainerDto Data to update.
   * @throws NotFoundException if container is not found.
   * @returns The updated container.
   */
  async update(id: string, updateContainerDto: UpdateContainerDto) {
    const result = await this.containerRepository.update(id, updateContainerDto);
    if (!result.affected || result.affected < 1) throw new NotFoundException();
    return this.findOne(id);
  }

  /**
   * Deletes a container by its ID.
   * @param id Container UUID.
   * @returns The deleted container.
   */
  remove(id: string) {
    const containerDelete = this.findOne(id);
    this.containerRepository.delete(id);
    return containerDelete;
  }
}
