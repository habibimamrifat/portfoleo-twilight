import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemModule } from './system/system.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PipeModule } from './pipes/validation.pipe';
import { PrismaModule } from './prisma/prisma.module';
import { AppConfigModule } from './config/config.module';
import { JwtCustomModule } from './helpers/jwt/jwtCustom.service';
import { BcryptModule } from './helpers/bcript/bcript.module';

@Module({
  imports: [
    SystemModule,
    AuthModule,
    UserModule,
    PipeModule,
    PrismaModule,
    AppConfigModule,
    JwtCustomModule,
    BcryptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
