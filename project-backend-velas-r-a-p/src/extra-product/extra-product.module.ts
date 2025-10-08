import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraProductService } from './extra-product.service';
import { ExtraProductController } from './extra-product.controller';
import { ExtraProduct } from './entities/extra-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExtraProduct])],
  controllers: [ExtraProductController],
  providers: [ExtraProductService],
  exports: [ExtraProductService]
})
export class ExtraProductModule {} 