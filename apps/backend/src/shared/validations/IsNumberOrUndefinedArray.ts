import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator"

export function IsNumberOrUndefinedArray(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isNumberOrUndefinedArray",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false
          }

          return value.every(
            item =>
              item === undefined
              || (typeof item === "number" && !Number.isNaN(item)),
          )
        },

        defaultMessage(_args: ValidationArguments) {
          return "Each value must be a number or undefined"
        },
      },
    })
  }
}
