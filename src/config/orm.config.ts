import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Profile } from './../auth/profile.entity';
import { User } from './../auth/user.entity';
import { Attendee } from './../events/attendee.entity';
import { Event } from './../events/event.entity';
import { Subject } from './../school/subject.entity';
import { Teacher } from './../school/teacher.entity';
import { Course } from 'src/school/course.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [Event, Attendee, Subject, Teacher, User, Profile, Course],
    synchronize: true,
    dropSchema: Boolean(parseInt(process.env.DB_DROP_SCHEMA)),
  }),
);
