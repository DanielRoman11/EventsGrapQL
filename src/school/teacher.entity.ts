import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from './subject.entity';
// import { ObjectType } from '@nestjs/graphql';

@Entity()
// @ObjectType()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  subjects: Subject[];
}
