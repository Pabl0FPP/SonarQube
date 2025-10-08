import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedCommand } from './seed.command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Fragance } from '../fragance/entities/fragance.entity';
import { Container } from '../container/entities/container.entity';
import { Candle } from '../candle/entities/candle.entity';
import { SeedController } from './seed.controller';
import { Order } from 'src/orders/entities/order.entity';
import { ExtraProduct } from 'src/extra-product/entities/extra-product.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Fragance,
      Container,
      Candle,
      Order,
      ExtraProduct
    ]),
  ],
  providers: [SeedService, SeedCommand],
  controllers: [SeedController]
})
export class SeedModule {}
