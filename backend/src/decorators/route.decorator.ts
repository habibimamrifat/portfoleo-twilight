import { SetMetadata } from '@nestjs/common';

export const ROUTE_TYPE_KEY = 'route_type';

export type RouteType = 'ADMIN' | 'PUBLIC';

export const routeTypeObj = {
  ADMIN: 'ADMIN',
  PUBLIC: 'PUBLIC',
} as const;

export const RouteFor = (type: RouteType) => SetMetadata(ROUTE_TYPE_KEY, type);
