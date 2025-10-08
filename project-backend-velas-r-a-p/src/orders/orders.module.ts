import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Candle } from '../candle/entities/candle.entity';
import { ExtraProduct } from '../extra-product/entities/extra-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Candle, ExtraProduct])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
