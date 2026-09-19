import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtCustomService } from '../helpers/jwt/jwtCustom.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtCustomService: JwtCustomService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    console.log('========== AUTH GUARD ==========');
    console.log('METHOD:', request.method);
    console.log('URL:', request.originalUrl);
    console.log('AUTHORIZATION HEADER:', request.headers.authorization);
    console.log('ALL HEADERS:', request.headers);

    const authorization = request.headers.authorization;

    if (!authorization) {
      console.error('AUTH GUARD: AUTHORIZATION HEADER IS MISSING');

      throw new UnauthorizedException('Authentication required');
    }

    const [type, token] = authorization.split(' ');

    console.log('AUTH TYPE:', type);

    console.log('TOKEN EXISTS:', !!token);

    if (type !== 'Bearer' || !token) {
      console.error('AUTH GUARD: INVALID AUTHORIZATION HEADER');

      throw new UnauthorizedException('Invalid authorization header');
    }

    try {
      const payload = this.jwtCustomService.verifyAuthToken(token);

      console.log('AUTH TOKEN VERIFIED:', true);
      console.log('USER PAYLOAD:', payload);

      request.user = payload;

      console.log('AUTH GUARD: ACCESS GRANTED');
      console.log('================================');

      return true;
    } catch (error) {
      console.error('AUTH GUARD: TOKEN VERIFICATION FAILED');
      console.error(error);
      console.log('================================');

      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
