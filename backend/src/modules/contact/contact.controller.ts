import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';
import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @RouteFor(routeTypeObj.PUBLIC)
  @HttpCode(HttpStatus.OK)
  async sendMail(@Body() contactDto: ContactDto) {
    return this.contactService.sendMail(contactDto);
  }
}
