import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { Document } from 'mongodb';
import { requiresPayload } from '../util/auth';
import { PropertyUpdate } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
    if (!requiresPayload(createUserDto, response,
      ['name', 'email', 'password', 'type', 'role'])) {
      return;
    }
    const [status, newUser] = await this.userService.create(createUserDto);
    response.status(status).send(newUser);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const [status, user] = await this.userService.findOne(id);
    response.status(status).send(user);
  }

  @Patch(':id')
  async update(@Param('id') id: string,
               @Body() newData: Document,
               @Res() response: Response) {
    const [status, user] = await this.userService.update(id, newData);
    response.status(status).send(user);
  }

  @Patch(':id/:property')
  async updateProperty(
    @Param('id') id: string,
    @Param('property') property: string,
    @Body() newValue: PropertyUpdate,
    @Res() response: Response,
  ) {
    const [status, user] = await this.userService.updateProperty(id, property, newValue);
    response.status(status).send(user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    const status = await this.userService.remove(id);
    response.status(status).send();
  }
}
