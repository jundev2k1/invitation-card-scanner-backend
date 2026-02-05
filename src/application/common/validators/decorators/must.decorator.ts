import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function Must(
  callback: (value: any, args: ValidationArguments) => boolean | Promise<boolean>,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          return await callback(value, args);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} failed custom validation check`;
        }
      },
    });
  };
}