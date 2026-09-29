import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateBannerQuoteDto,
  UpdateBannerQuoteDto,
} from './dto/banner-quote.dto';

@Injectable()
export class BannerQuoteService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne() {
    const bannerQuote = await this.prisma.bannerQuote.findFirst();

    if (!bannerQuote) {
      throw new NotFoundException('Banner quote not found');
    }

    return bannerQuote;
  }

  async create(bannerQuoteDto: CreateBannerQuoteDto) {
    const existingBannerQuote = await this.prisma.bannerQuote.findFirst();

    if (existingBannerQuote) {
      throw new ConflictException('Banner quote already exists');
    }

    return this.prisma.bannerQuote.create({
      data: {
        primaryText: bannerQuoteDto.primaryText,
        secondaryText: bannerQuoteDto.secondaryText,
      },
    });
  }

  async update(bannerQuoteDto: UpdateBannerQuoteDto) {
    const existingBannerQuote = await this.prisma.bannerQuote.findFirst();

    if (!existingBannerQuote) {
      throw new NotFoundException('Banner quote not found');
    }

    return this.prisma.bannerQuote.update({
      where: {
        id: existingBannerQuote.id,
      },
      data: {
        primaryText: bannerQuoteDto.primaryText,
        secondaryText: bannerQuoteDto.secondaryText,
      },
    });
  }
}
