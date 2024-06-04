import { PartialType } from '@nestjs/graphql';
import { SubjectAddInput } from './subject-add.input';

export class SubjectEditInput extends PartialType(SubjectAddInput) {}
