import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';
import { Course } from './course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubjectAddInput } from './input/subject-add.input';
import { Logger } from '@nestjs/common';

@Resolver(() => Subject)
export class SubjectResolver {
  private readonly logger = new Logger(SubjectResolver.name);
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
  ) {}

  @Mutation(() => Subject, { name: 'subjectAdd' })
  public async add(
    @Args('input', { type: () => SubjectAddInput })
    input: SubjectAddInput,
  ): Promise<Subject> {
    const subject = await this.subjectRepo.save(new Subject(input));
    this.logger.debug(this.subjectRepo.createQueryBuilder('s').getQuery());
    return subject;
  }

  @ResolveField('teachers', () => [Teacher])
  public async teachers(@Parent() subject: Subject): Promise<Teacher[]> {
    return await subject.teachers;
  }

  @ResolveField('courses', () => [Course])
  public async courses(@Parent() subjects: Subject): Promise<Course[]> {
    return await subjects.courses;
  }
}
