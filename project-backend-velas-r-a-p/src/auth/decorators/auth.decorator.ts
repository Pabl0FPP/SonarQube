import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from './roles.decorator';
import { AuthGuard } from '../guard/auth.guard';
import { Role } from '../../common/role.enum';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(AuthGuard, RolesGuard)
  );
}
