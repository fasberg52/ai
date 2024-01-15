import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userDtoWithoutPassword } = createUserDto;
    if (!this.isPasswordStrong(password)) {
      throw new BadRequestException(
        'Password must contain both letters and numbers.',
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createdUser = new this.userModel({
      ...userDtoWithoutPassword,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  private isPasswordStrong(password: string): boolean {
    const letterRegex = /[a-zA-Z]/;
    const numberRegex = /\d/;
    const minLength = 4;
    return (
      password.length >= minLength &&
      letterRegex.test(password) &&
      numberRegex.test(password)
    );
  }
  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
