import type { AnyObject, ObjectSchema } from 'yup';
import { computed, type ComputedRef, ref, type Ref, toValue, watch } from 'vue';
import type { ValidationErrorsType } from '~/types/ValidationErrorsType';
import { validateAndSave } from '~/utils/validateAndSave';
import { isRef } from '#build/imports';

interface FormArgs<T extends object> {
  initialValue: ComputedRef<T> | Ref<T> | T;
  validationSchema: ObjectSchema<AnyObject> | ((formValue: T) => ObjectSchema<AnyObject>);
  onSubmit: (formValue: T) => void;
}

export const useForm = <T extends object>(args: FormArgs<T>) => {
  const { initialValue, validationSchema, onSubmit } = args;

  const formValue = ref<T>(structuredClone(toValue(initialValue))) as Ref<T>;
  const errors = ref<ValidationErrorsType>(undefined);

  if (isRef(initialValue)) {
    watch(() => initialValue.value, (newValue) => {
      formValue.value = structuredClone(newValue);
    }, { deep: true });
  }

  const isFormValueChanged = computed(() => {
    return JSON.stringify(formValue.value) !== JSON.stringify(toValue(initialValue));
  });

  const resetToInitialValue = () => {
    formValue.value = structuredClone(toValue(initialValue));
    errors.value = undefined;
  };

  const onFormSubmit = async () => {
    const currentValidationSchema = typeof validationSchema === 'function' ? validationSchema(formValue.value) : validationSchema;
    await validateAndSave(formValue.value, currentValidationSchema, errors, () => {
      onSubmit(formValue.value as T);
    });
  };

  return {
    onFormSubmit,
    resetToInitialValue,
    isFormValueChanged,
    formValue,
    errors,
  };
};
