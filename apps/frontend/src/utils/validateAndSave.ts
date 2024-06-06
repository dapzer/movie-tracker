import { type AnyObject, ObjectSchema, ValidationError } from 'yup';
import type { ValidationErrorsType } from '~/types/ValidationErrorsType';
import { type Ref } from 'vue';

const reduceYupErrors = (yupErrors: ValidationError[]) => {
  return yupErrors.reduce<Record<string, string[]>>((acc, er) => {
    const path = er.path;
    if (!path) throw Error('Yup error without path. Should not happen.');
    if (Array.isArray(acc[path])) {
      (acc[path] as Array<string>).push(er.message);
    } else {
      acc[path] = [er.message];
    }
    return acc;
  }, {});
};

export const validateAndSave = async (
  formValue: unknown,
  schema: ObjectSchema<AnyObject>,
  errors: Ref<ValidationErrorsType>,
  onSave: () => void,
) => {
  try {
    await schema.validate(formValue, { abortEarly: false });
    errors.value = undefined;
    onSave();
  } catch (error) {
    if (error instanceof ValidationError) {
      errors.value = reduceYupErrors(error.inner);
      return
    }

    throw error;
  }
};
