import { Module } from '@nestjs/common';
import { ContainerService } from './container.service';
import { ContainerController } from './container.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Container } from './entities/container.entity';

@Module({
  controllers: [ContainerController],
  providers: [ContainerService],
  imports: [
    TypeOrmModule.forFeature([Container]),
  ],
  exports: [ContainerService],
})
export class ContainerModule {}
