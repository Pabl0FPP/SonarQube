import { Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';
import { FraganceModule } from '../fragance/fragance.module';

@Module({
  providers: [RulesService],
  controllers: [RulesController],
  imports: [FraganceModule]
})
export class RulesModule {}
