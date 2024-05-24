import {
  Args,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Parent
} from '@nestjs/graphql';
import { Teacher } from './teacher.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger, Param } from '@nestjs/common';
import { TeacherAddInput } from './input/teacher-add.input';

@Resolver(() => Teacher)
export class TeacherResolver {
  private readonly teacherLogger = new Logger(TeacherResolver.name);
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepo: Repository<Teacher>,
  ) {}

  private teachersBaseQuery(): SelectQueryBuilder<Teacher> {
    return this.teachersRepo.createQueryBuilder('t');
  }

  @Query(() => [Teacher])
  public async teachers(): Promise<Teacher[]> {
    const query = this.teachersBaseQuery()
    this.teacherLogger.debug('Find All: ' + query.getQuery());
    return await query.getMany();
  }

  @Query(() => Teacher)
  public async teacher(
    @Args('id', { type: () => Int })
    id: Pick<Teacher, 'id'>,
  ): Promise<Teacher> {
    const query = this.teachersBaseQuery()
      .where('t.id = :id', { id })
    this.teacherLogger.debug('Find One: ' + query.getQuery());
    return await query.getOneOrFail();
  }

  @Mutation(() => Teacher, { name: 'teacherAdd' })
  public async add(
    @Args('input', { type: () => TeacherAddInput })
    input: TeacherAddInput,
  ) {
    const newTeacher = await this.teachersRepo.save(new Teacher(input));
    this.teacherLogger.debug(
      this.teachersRepo.createQueryBuilder('t').getQuery(),
    );
    return newTeacher;
  }

  @ResolveField('subjects')
  public async subjects(
    @Parent() teacher: Teacher
  ){
    this.teacherLogger.debug(`@ResolveField subjects was called`)
    return await teacher.subjects;
  }
}
