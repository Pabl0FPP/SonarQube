import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../common/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);


    // If no roles are required, we allow access by default"
    if(!requiredRoles)
      return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if(!user)
      throw new BadRequestException('User not found');

    for (const role of user.roles) {
      if (role === Role.ADMIN || requiredRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(`User does not have the required roles: ${requiredRoles.join(", ")}`);

    
  }
}
