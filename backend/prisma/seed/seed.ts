import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../src/prisma/prisma.service';

export async function seedDatabase(
  prisma: PrismaService,
  config: ConfigService,
) {
  const email = config.get<string>('SEED_ADMIN_EMAIL');
  const password = config.get<string>('SEED_ADMIN_PASSWORD');

  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: {
      email,
    },

    update: {
      passwordHash,
      role: 'ADMIN',
      isActive: true,
    },

    create: {
      name: config.get<string>('SEED_ADMIN_NAME') ?? 'Admin',
      email,
      passwordHash,

      img: config.get<string>('SEED_ADMIN_IMAGE'),
      phone: config.get<string>('SEED_ADMIN_PHONE'),
      location: config.get<string>('SEED_ADMIN_LOCATION'),
      description: config.get<string>('SEED_ADMIN_DESCRIPTION'),

      githubUrl: config.get<string>('SEED_ADMIN_GITHUB'),
      linkedinUrl: config.get<string>('SEED_ADMIN_LINKEDIN'),
      resumeUrl: config.get<string>('SEED_ADMIN_RESUME'),

      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log(`Admin user ready: ${user.email}`);
}
