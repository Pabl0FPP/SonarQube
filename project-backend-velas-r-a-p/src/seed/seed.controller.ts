import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/role.enum';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @Auth(Role.ADMIN)
  async runSeed() {
    await this.seedService.seedDatabase();
    return { message: 'Seed ejecutado correctamente' };
  }
}