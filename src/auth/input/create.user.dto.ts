import { IsEmail, Length } from 'class-validator';
import { IsRepeated } from '../../validation/is-repeated.constraint';
import { UserNotExists } from '../validation/user-not-exist.constraint';

export class CreateUserDto {
  @Length(5)
  @UserNotExists()
  username: string;

  @Length(8)
  password: string;

  @Length(8)
  @IsRepeated('password')
  retypedPassword: string;

  @Length(2)
  firstName: string;

  @Length(2)
  lastName: string;

  @IsEmail()
  @UserNotExists()
  email: string;
}
