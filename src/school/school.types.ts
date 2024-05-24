import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

@ObjectType()
export class EntityWithNumberId {
  constructor(id: number) {
    this.id = id;
  }

  @Field(() => Int)
  id: number;
}

@ObjectType()
export class EntityWithStringId {
  constructor(id: string) {
    this.id = id;
  }

  @Field(() => String)
  id: string;
}

registerEnumType(Gender, { name: 'Gender' });
