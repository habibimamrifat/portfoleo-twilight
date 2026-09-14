import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalFilter } from './filters/global-filter.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { PrismaService } from './prisma/prisma.service';
import { seedDatabase } from '../prisma/seed/seed';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalFilter());
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));
  const prisma = app.get(PrismaService);
  const config = app.get(ConfigService);

  await seedDatabase(prisma, config);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`server is running on port ${process.env.PORT || 3000}`);
}
bootstrap();
