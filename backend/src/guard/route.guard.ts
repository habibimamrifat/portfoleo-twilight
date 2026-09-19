import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROUTE_TYPE_KEY, RouteType } from '../decorators/route.decorator';

import { AuthGuard } from './auth.guard';

@Injectable()
export class RouteGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authGuard: AuthGuard,
  ) {}

  canActivate(context: ExecutionContext) {
    const routeType = this.reflector.getAllAndOverride<RouteType>(
      ROUTE_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Explicitly public
    if (routeType === 'PUBLIC') {
      return true;
    }

    // admin OR no @Route() → authentication required
    return this.authGuard.canActivate(context);
  }
}
