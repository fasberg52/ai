import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  BadRequestException,
  Get,
} from '@nestjs/common';

@Controller('auth')
export class UsersController {}
