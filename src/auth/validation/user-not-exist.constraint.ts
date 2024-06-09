import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ async: true })
export class UserNotExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const entity = await this.userRepo.findOneBy({
      [validationArguments.property]: value,
    });

    return entity === null;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} is already taken.`;
  }
}

export function UserNotExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UserNotExistsConstraint,
    });
  };
}
