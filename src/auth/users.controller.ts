import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { CreateUserDto } from './input/create.user.dto';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createUserDto: CreateUserDto) {
    // if (createUserDto.password !== createUserDto.retypedPassword) {
    //   throw new BadRequestException(['Passwords are not identical']);
    // }

    // const existingUser = await this.userRepository.findOne({
    //   where: [
    //     { username: createUserDto.username },
    //     { email: createUserDto.email },
    //   ],
    // });

    // if (existingUser) {
    //   throw new BadRequestException(['username or email is already taken']);
    // }

    const user = await this.userRepository.save(new User(createUserDto));

    return {
      ...user,
      token: this.authService.getTokenForUser(user),
    };
  }
}
