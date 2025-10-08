import { Module } from '@nestjs/common';
    import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Candle } from 'src/candle/entities/candle.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Container } from 'src/container/entities/container.entity';
import { Fragance } from 'src/fragance/entities/fragance.entity';
import { Order } from 'src/orders/entities/order.entity';
import { PaymentLocal } from 'src/payments/entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
    import { DataSource } from 'typeorm';
    
    export const testDbConfig: TypeOrmModuleOptions = {
      type: 'sqlite',
      database: ':memory:',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      dropSchema: true,
    };
    
    @Module({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async () => testDbConfig,
          dataSourceFactory: async (options) => {
            if (!options) {
              throw new Error('DataSource options are undefined');
            }
            const dataSource = new DataSource(options);
            await dataSource.initialize();
            return dataSource;
          },
        }),
        TypeOrmModule.forFeature([Fragance, User, Candle, Cart, CartItem, Container, Order, PaymentLocal]), // Add your entities here if needed
      ],
      exports: [TypeOrmModule],
    })
    export class TestModule {}