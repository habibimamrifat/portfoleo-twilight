import { SetMetadata } from '@nestjs/common';

export const ROUTE_TYPE_KEY = 'route_type';

export type RouteType = 'admin' | 'public';
export const routeTypeObj = {
  ADMIN: 'admin',
  PUBLIC: 'public',
} as const;

export const RouteFor = (type: RouteType) => SetMetadata(ROUTE_TYPE_KEY, type);
