import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export type CurrentUserType = {
  sub: string;
  email: string;
  role: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUserType => {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedException('Authentication required');
    }

    return request.user as CurrentUserType;
  },
);
