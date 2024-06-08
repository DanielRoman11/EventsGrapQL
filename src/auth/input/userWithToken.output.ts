import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../user.entity';

@ObjectType()
export class UserWithTokenOutput extends User {
  constructor(partial: Partial<UserWithTokenOutput>) {
    super();
    Object.assign(this, partial);
  }

  @Field()
  token: string;
}
