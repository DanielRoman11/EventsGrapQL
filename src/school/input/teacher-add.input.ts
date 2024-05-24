import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { Gender } from '../school.types';

@InputType()
export class TeacherAddInput {
  @Field()
  @IsNotEmpty()
  @Length(5)
  name: string;

  @Field(() => Gender)
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}
