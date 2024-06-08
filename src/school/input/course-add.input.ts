import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';

@InputType()
export class CourseAddInput {
  @Field()
  @IsNotEmpty()
  @Length(3)
  name: string;

  @Field()
  @IsNotEmpty()
  teacherId: number;

  @Field()
  @IsNotEmpty()
  subjectId: number;
}
