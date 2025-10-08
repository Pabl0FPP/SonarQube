import { Module } from '@nestjs/common';
import { CandleService } from './candle.service';
import { CandleController } from './candle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candle } from './entities/candle.entity';
import { FraganceModule } from '../fragance/fragance.module';
import { ContainerModule } from '../container/container.module';


@Module({
  imports: [TypeOrmModule.forFeature([Candle]),
FraganceModule, ContainerModule],
  controllers: [CandleController],
  providers: [CandleService],
  exports: [CandleService],
})
export class CandleModule {}
