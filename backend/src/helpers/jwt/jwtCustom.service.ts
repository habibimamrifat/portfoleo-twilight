import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtCustomService {
  constructor(
    private readonly jwtService: JwtService,

    @Inject('AUTH_TOKEN')
    private readonly authToken: any,

    @Inject('RENEW_TOKEN')
    private readonly renewToken: any,
  ) {}

  // =========================
  // AUTH TOKEN
  // =========================

  createAuthToken(payload: object) {
    return this.jwtService.sign(payload, {
      secret: this.authToken.secret,
      expiresIn: this.authToken.expiresIn,
      issuer: this.authToken.issuer,
    });
  }

  verifyAuthToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.authToken.secret,
      issuer: this.authToken.issuer,
    });
  }

  decodeAuthToken(token: string) {
    return this.jwtService.decode(token);
  }

  // =========================
  // RENEW TOKEN
  // =========================

  createRenewToken(payload: object) {
    return this.jwtService.sign(payload, {
      secret: this.renewToken.secret,
      expiresIn: this.renewToken.expiresIn,
      issuer: this.renewToken.issuer,
    });
  }

  verifyRenewToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.renewToken.secret,
      issuer: this.renewToken.issuer,
    });
  }

  decodeRenewToken(token: string) {
    return this.jwtService.decode(token);
  }
}
