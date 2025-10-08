import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCandleDto } from './dto/create-candle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Candle } from './entities/candle.entity';
import { Repository } from 'typeorm';
import { FraganceService } from '../fragance/fragance.service';
import { ContainerService } from '../container/container.service';

@Injectable()
export class CandleService {
  constructor(
    @InjectRepository (Candle) private candleRepository: Repository<Candle>,
    private readonly fraganceService: FraganceService,
    private readonly containerService: ContainerService
  ) {}

  /**
   * Creates a new candle after validating fragance and container existence.
   * @param dto Data for the new candle.
   * @returns The created candle.
   * @throws NotFoundException if fragance or container is not found.
   */
  async create(dto: CreateCandleDto): Promise<Candle> {
    const fraganceExists = await this.fraganceService.findOne(dto.fraganceId);
    const containerExists = await this.containerService.findOne(dto.containerId);

    if (!fraganceExists || !containerExists) {
      throw new NotFoundException('Fragancia o contenedor no encontrado');
    }

    const candle = this.candleRepository.create({
      message: dto.message,
      qr: dto.qr,
      image: dto.image,
      fragance: { id: dto.fraganceId },
      container: { id: dto.containerId },
    });

    return await this.candleRepository.save(candle);
  }

  /**
   * Returns a candle by its ID.
   * @param id Candle UUID.
   * @throws NotFoundException if candle is not found.
   * @returns The candle.
   */
  async findOne(id: string) {
    const candle = await this.candleRepository.findOneBy({ id });
    if (!candle) throw new NotFoundException();
    return candle
  }
}
