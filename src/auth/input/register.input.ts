import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';
import { UserNotExists } from '../validation/user-not-exist.constraint';
import { IsRepeated } from '../../validation/is-repeated.constraint';

@InputType()
export class RegisterUserInput {
  @Field()
  @Length(5)
  @UserNotExists()
  username: string;

  @Field()
  @Length(8)
  password: string;

  @Field()
  @Length(8)
  @IsRepeated('password')
  retypedPassword: string;

  @Field()
  @Length(2)
  firstName: string;

  @Field()
  @Length(2)
  lastName: string;

  @Field()
  @IsEmail()
  @UserNotExists()
  email: string;
}
