import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';

@Entity()
@ObjectType()
export class Course {
  constructor(partial: Partial<Course>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: true })
  id: number;

  @Column()
  @Field()
  name: string;

  @ManyToOne(() => Subject, (subject) => subject.courses, { cascade: true })
  @Field(() => Subject, { nullable: true })
  subject: Promise<Subject>;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses, { cascade: true })
  @Field(() => Teacher, { nullable: true })
  teacher: Promise<Teacher>;
}
