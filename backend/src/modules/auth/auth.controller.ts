import { Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';

import { AuthService } from './auth.service';
import { LoginDto, ChangePasswordDto } from './dto/auth.dto';
import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @RouteFor(routeTypeObj.PUBLIC)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @RouteFor(routeTypeObj.PUBLIC)
  @Post('renew')
  renew(@Req() request: Request) {
    return this.authService.renew(request);
  }

  @RouteFor(routeTypeObj.ADMIN)
  @Post('change-password')
  changePassword(
    @Req() request: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(request, changePasswordDto);
  }

  @RouteFor(routeTypeObj.ADMIN)
  @Post('logout')
  logout(@Req() request: Request) {
    return this.authService.logout(request);
  }
}
