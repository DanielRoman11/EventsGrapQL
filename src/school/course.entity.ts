import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';

@Entity()
@ObjectType()
export class Course {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @ManyToOne(() => Subject, (subject) => subject.courses)
  @Field(() => Subject, { nullable: true })
  subject: Promise<Subject>;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  @Field(() => Teacher, { nullable: true })
  teacher: Promise<Teacher>;
}
