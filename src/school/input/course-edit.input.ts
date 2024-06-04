import { InputType, PartialType } from '@nestjs/graphql';
import { CourseAddInput } from './course-add.input';

@InputType()
export class CourseEditInput extends PartialType(CourseAddInput) {}
