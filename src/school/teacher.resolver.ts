import {
  Args,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import { Teacher } from './teacher.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger, UseGuards } from '@nestjs/common';
import { TeacherAddInput } from './input/teacher-add.input';
import { TeacherEditInput } from './input/teacher-edit.input';
import { EntityWithNumberId } from './school.types';
import { AuthGuardJWTGql } from 'src/auth/auth-guard.jwt.gql';

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
    const query = this.teachersBaseQuery();
    this.teacherLogger.debug('Find All: ' + query.getQuery());
    return await query.getMany();
  }

  @Query(() => Teacher)
  public async teacher(
    @Args('id', { type: () => Int })
    id: Pick<Teacher, 'id'>,
  ): Promise<Teacher> {
    const query = this.teachersBaseQuery().where('t.id = :id', { id });
    this.teacherLogger.debug('Find One: ' + query.getQuery());
    return await query.getOneOrFail();
  }

  @Mutation(() => Teacher, { name: 'teacherAdd' })
  @UseGuards(AuthGuardJWTGql)
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

  @Mutation(() => Teacher, { name: 'teacherEdit' })
  @UseGuards(AuthGuardJWTGql)
  public async edit(
    @Args('id', { type: () => Int })
    id: Pick<Teacher, 'id'>,
    @Args('input', { type: () => TeacherEditInput })
    input: TeacherEditInput,
  ) {
    const query = this.teachersBaseQuery();
    const teacher = await query.where('t.id = :id', { id }).getOneOrFail();

    this.teacherLogger.debug(`The teacher ${teacher.name}, was modified`);

    return await this.teachersRepo.save(
      new Teacher(Object.assign(teacher, input)),
    );
  }

  @Mutation(() => EntityWithNumberId, { name: 'teacherDelete' })
  @UseGuards(AuthGuardJWTGql)
  public async delete(
    @Args('id', { type: () => Int })
    id: number,
  ): Promise<EntityWithNumberId> {
    const query = this.teachersBaseQuery();
    const teacher = await query.where('t.id = :id', { id }).getOneOrFail();

    await this.teachersRepo
      .delete(teacher.id)
      .then(() => {
        this.teacherLogger.debug(`Teacher with id ${id} was deleted`);
      })
      .catch((err) => {
        this.teacherLogger.error(err);
      });

    return new EntityWithNumberId(id);
  }

  @ResolveField('subjects')
  public async subjects(@Parent() teacher: Teacher) {
    this.teacherLogger.debug(`@ResolveField subjects was called`);
    return await teacher.subjects;
  }
}
