import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field()
  @Length(5)
  username: string;

  @Field()
  @Length(8)
  password: string;

  @Field()
  @Length(8)
  retypedPassword: string;

  @Field()
  @Length(2)
  firstName: string;

  @Field()
  @Length(2)
  lastName: string;

  @Field()
  @IsEmail()
  email: string;
}
