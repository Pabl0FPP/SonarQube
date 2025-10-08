import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ContainerModule } from './container/container.module';
import { FraganceModule } from './fragance/fragance.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CandleModule } from './candle/candle.module';
import { RulesModule } from './rules/rules.module';
import { AiModule } from './ai/ai.module';
import { DatabaseConfigService } from './config/database.config';
import { SeedModule } from './seed/seed.module';
import { QrModule } from './qr/qr.module';
import { OrdersModule } from './orders/orders.module';
import { ExtraProductModule } from './extra-product/extra-product.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), 
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService
    }),
    UsersModule,
    ContainerModule,
    FraganceModule,
    AuthModule,
    CandleModule,
    RulesModule,
    AiModule,
    SeedModule,
    QrModule,
    OrdersModule,
    ExtraProductModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
