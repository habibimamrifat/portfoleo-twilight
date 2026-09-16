import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, ChangePasswordDto } from './dto/auth.dto';
import { BcryptService } from '../helpers/bcript/bcript.service';
import { JwtCustomService } from '../helpers/jwt/jwtCustom.module';
import { CurrentUserType } from '../decorators/current-user.decorator';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtCustomService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    const passwordMatched = await this.bcryptService.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    } as CurrentUserType;

    const authToken = this.jwtService.createAuthToken(payload);

    const renewToken = this.jwtService.createRenewToken(payload);

    return {
      authToken,
      renewToken,
    };
  }

  async renew(request: Request) {
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Renew token required');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    let payload: {
      sub?: string;
    };

    try {
      payload = this.jwtService.verifyRenewToken(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired renew token');
    }

    if (!payload.sub) {
      throw new UnauthorizedException('Invalid renew token');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    const authToken = this.jwtService.createAuthToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      authToken,
    };
  }

  async changePassword(request: Request, changePasswordDto: ChangePasswordDto) {
    const userId = request.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    const passwordMatched = await this.bcryptService.compare(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const passwordHash = await this.bcryptService.hash(
      changePasswordDto.newPassword,
    );

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash,
      },
    });

    return {
      message: 'Password changed successfully',
    };
  }

  async logout(request: Request) {
    const userId = request.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }

    return {
      message: 'Logout successful',
    };
  }
}
