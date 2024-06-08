import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserInput } from './input/register.input';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  public getTokenForUser(user: User): string {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { username },
    });

    if (!user) {
      this.logger.debug(`User ${username} not found!`);
      throw new UnauthorizedException();
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Invalid credentials for user ${username}`);
      throw new UnauthorizedException();
    }

    return user;
  }

  public async createNewUser(input: RegisterUserInput) {
    if (input.password !== input.retypedPassword)
      throw new BadRequestException('Passwords are different');

    if (
      await this.userRepo.exists({
        where: [{ email: input.email }, { username: input.username }],
      })
    )
      throw new BadRequestException('This user/email is already taken');
    return await this.userRepo.save(input);
  }
}
