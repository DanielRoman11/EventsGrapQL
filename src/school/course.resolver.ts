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
import { Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseEditInput } from './input/course-edit.input';
import { EntityWithNumberId } from './school.types';

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

  @Query(() => Course)
  public async course(
    @Args('id', { type: () => Number })
    id: number,
  ) {
    const query = this.courseBaseQuery();
    const course = query.where({ id });
    this.logger.debug(course.getQuery());
    return await course.getOneOrFail();
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
    @Args('id', { type: () => Number }) id: number,
    @Args('input', { type: () => CourseEditInput }) input: CourseEditInput,
  ) {
    const query = this.courseBaseQuery();
    const coursePrev = await query.where('c.id = :id', { id }).getOne();

    if (!coursePrev) {
      throw new NotFoundException('Course not found');
    }

    const [teacher, subject] = await Promise.all([
      input.teacherId
        ? this.teacherRepo
            .createQueryBuilder('t')
            .where('t.id = :id', { id: input.teacherId })
            .getOne()
        : Promise.resolve(null),
      input.subjectId
        ? this.subjectRepo
            .createQueryBuilder('s')
            .where('s.id = :id', { id: input.subjectId })
            .getOne()
        : Promise.resolve(null),
    ]);

    if (input.teacherId && !teacher) {
      throw new NotFoundException('Teacher not found');
    }
    if (input.subjectId && !subject) {
      throw new NotFoundException('Subject not found');
    }

    const course = this.courseRepo.create({
      ...coursePrev,
      ...input,
    });

    teacher && (course.teacher = teacher);
    subject && (course.subject = subject);

    return await this.courseRepo
      .save(course)
      .then((result) => {
        this.logger.debug(`Course with id "${id}" edited successfully`);
        return result;
      })
      .catch((err) => {
        this.logger.error(err);
      });
  }

  @Mutation(() => EntityWithNumberId, { name: 'courseDelete' })
  public async delete(
    @Args('id', { type: () => Number })
    id: number,
  ): Promise<EntityWithNumberId> {
    const query = this.courseBaseQuery();
    const course = await query.where({ id }).getOneOrFail();

    await this.courseRepo
      .delete(course.id)
      .then(() => {
        this.logger.debug(
          `Course with ID ${course.id} been deleted successfully`,
        );
      })
      .catch((err) => {
        this.logger.error(err);
      });

    return new EntityWithNumberId(id);
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
