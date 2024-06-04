import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';
import { Optional } from '@nestjs/common';

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
