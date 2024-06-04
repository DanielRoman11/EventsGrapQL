import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';

@InputType()
export class SubjectAddInput {
  @Field()
  @IsNotEmpty()
  @Length(5)
  name: string;
}
