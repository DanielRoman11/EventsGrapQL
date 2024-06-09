import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsRepeated(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRepeated',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return !args.object.hasOwnProperty(property)
            ? false
            : value === args.object[property];
        },
        defaultMessage(): string {
          return `${propertyName} needs to be identical to property ${property}`;
        },
      },
    });
  };
}
