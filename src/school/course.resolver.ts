import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Course } from './course.entity';
import { Teacher } from './teacher.entity';
import { Subject } from './subject.entity';
import { CourseAddInput } from './input/course-add.input';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseEditInput } from './input/course-edit.input';

@Resolver(() => Course)
export class CourseResolver {
  private readonly logger = new Logger(CourseResolver.name);
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
  ) {}

  private courseBaseQuery() {
    return this.courseRepo.createQueryBuilder('c');
  }

  @Query(() => [Course])
  public async courses() {
    const query = this.courseBaseQuery();
    this.logger.debug(query.getQuery());
    return await query.getMany();
  }

  @Mutation(() => Course, { name: 'courseAdd' })
  public async add(
    @Args('input', { type: () => CourseAddInput })
    input: CourseAddInput,
  ) {
    const teacher = await this.teacherRepo.findOneByOrFail({
      id: input.teacherId,
    });
    const subject = await this.subjectRepo.findOneByOrFail({
      id: input.subjectId,
    });

    const course = new Course({
      name: input.name,
      subject: Promise.resolve(subject),
      teacher: Promise.resolve(teacher),
    });

    await this.courseRepo.save(course);

    this.logger.debug(this.courseRepo.createQueryBuilder('c').getQuery());
    console.log(course);
    return course;
  }

  @Mutation(() => Course, { name: 'courseEdit' })
  public async edit(
    @Args('id', { type: () => Number })
    id: Pick<Course, 'id'>,
    @Args('input', { type: () => CourseEditInput })
    input: CourseEditInput,
  ) {
    const query = this.courseBaseQuery();
    const coursePrev = await query.where({ id }).getOneOrFail();

    const teacher = await this.teacherRepo.findOneByOrFail({
      id: input.teacherId,
    });
    const subject = await this.subjectRepo.findOneByOrFail({
      id: input.subjectId,
    });

    const courseEdited = await this.courseRepo.save(
      new Course({
        id: coursePrev.id,
        name: input.name,
        subject: Promise.resolve(subject),
        teacher: Promise.resolve(teacher),
      }),
    );
    this.logger.debug(this.courseRepo.createQueryBuilder('c').getQuery());

    return courseEdited;
  }

  @ResolveField('teacher')
  public async teacher(@Parent() course: Course): Promise<Teacher> {
    return await course.teacher;
  }

  @ResolveField('subject')
  public async subject(@Parent() course: Course): Promise<Subject> {
    return await course.subject;
  }
}
