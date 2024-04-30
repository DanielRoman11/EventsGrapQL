import {
  Args,
  Int,
  Mutation,
  PickType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Teacher } from './teacher.entity';
import { InsertResult, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';

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
    const query = this.teachersBaseQuery().leftJoinAndSelect('t.subjects', 's');
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
      .leftJoinAndSelect('t.subjects', 's');
    this.teacherLogger.debug('Find One: ' + query.getQuery());
    return await query.getOneOrFail();
  }

  @Mutation(() => Teacher, { name: 'teacherAdd' })
  public async add(
    @Args('input', { type: () => Teacher })
    teacher: Teacher,
  ) {
    const query = this.teachersRepo
      .createQueryBuilder('t')
      .insert()
      .into(Teacher)
      .values({ name: teacher.name, subjects: teacher.subjects });

    this.teacherLogger.debug(
      'Insert Teacher: ' + query.getQueryAndParameters(),
    );
    return await query.execute();
  }
}
