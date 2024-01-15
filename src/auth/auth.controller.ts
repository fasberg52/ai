import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<User> {
    const existingUser = await this.authService.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    return this.authService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body(new ValidationPipe()) { email, password }: CreateUserDto,
  ): Promise<{ user: User; status: number }> {
    const user = await this.authService.findByEmail(email);


    if (!user) {
      throw new BadRequestException('User Not Found');
    }

    const isMatchPassword = await this.authService.comparePasswords(
      password,
      user.password,
    );

    if (!isMatchPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    return { user, status: 200 };
  }
}
