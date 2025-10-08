import { Module } from '@nestjs/common';
import { FraganceService } from './fragance.service';
import { FraganceController } from './fragance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fragance } from './entities/fragance.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  exports: [TypeOrmModule, FraganceService],
  controllers: [FraganceController],
  providers: [FraganceService],
  imports: [
    TypeOrmModule.forFeature([Fragance]),
    JwtModule.register({
      secret: 'test-secret', // Configuración ficticia para pruebas
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class FraganceModule {}