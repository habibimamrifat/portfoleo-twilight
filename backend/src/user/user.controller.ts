import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from '../decorators/response-message.decorator';
import { RouteFor, routeTypeObj } from '../decorators/route.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('portfolio')
  @RouteFor(routeTypeObj.PUBLIC)
  @ResponseMessage('Portfolio retrieved successfully')
  getPortfolio() {
    return this.userService.getPortfolio();
  }

  @Post()
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('User created successfully')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Users retrieved successfully')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('User retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('User updated successfully')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('User deleted successfully')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}