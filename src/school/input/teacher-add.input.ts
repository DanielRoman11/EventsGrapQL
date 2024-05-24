import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, Length } from "class-validator";

@InputType()
export class TeacherAddInput{
  @Field()
  @IsNotEmpty()
  @Length(5)
  name: string;
}