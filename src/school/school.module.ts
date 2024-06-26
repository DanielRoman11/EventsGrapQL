import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';
import { TeacherResolver } from './teacher.resolver';
import { SubjectResolver } from './subject.resolver';
import { CourseResolver } from './course.resolver';
import { Course } from './course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher, Course])],
  providers: [TeacherResolver, SubjectResolver, CourseResolver],
  controllers: [],
})
export class SchoolModule {}
