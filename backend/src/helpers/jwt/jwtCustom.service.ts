import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtCustomService } from './jwtCustom.module';


@Global()
@Module({
  imports: [ConfigModule, JwtModule],

  providers: [
    {
      provide: 'AUTH_TOKEN',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_AUTH_SECRET'),
        expiresIn: config.getOrThrow('JWT_AUTH_EXPIRES_IN'),
        issuer: config.getOrThrow('JWT_ISSUER'),
      }),
    },

    {
      provide: 'RENEW_TOKEN',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_RENEW_SECRET'),
        expiresIn: config.getOrThrow('JWT_RENEW_EXPIRES_IN'),
        issuer: config.getOrThrow('JWT_ISSUER'),
      }),
    },

    JwtCustomService,
  ],

  exports: [JwtCustomService],
})
export class JwtCustomModule {}
