import type { ComputedRef, Ref } from "vue"
import type { AnyObject, ObjectSchema } from "yup"
import type { ValidationErrorsType } from "~/types/ValidationErrorsType"
import { isRef } from "#build/imports"
import { computed, ref, toValue, watch } from "vue"
import { validateAndSave } from "~/utils/validateAndSave"

interface FormArgs<T extends object> {
  initialValue: ComputedRef<T> | Ref<T> | T
  validationSchema?: ObjectSchema<AnyObject> | ((formValue: T) => ObjectSchema<AnyObject>)
  onSubmit: (formValue: T) => void
}

export function useForm<T extends object>(args: FormArgs<T>) {
  const { initialValue, validationSchema, onSubmit } = args

  const formValue = ref<T>(structuredClone(toValue(initialValue))) as Ref<T>
  const errors = ref<ValidationErrorsType>(undefined)

  if (isRef(initialValue)) {
    watch(() => initialValue.value, (newValue) => {
      formValue.value = structuredClone(newValue)
    }, { deep: true })
  }

  const isFormValueChanged = computed(() => {
    return JSON.stringify(formValue.value) !== JSON.stringify(toValue(initialValue))
  })

  const resetToInitialValue = () => {
    formValue.value = structuredClone(toValue(initialValue))
    errors.value = undefined
  }

  const onFormSubmit = async () => {
    if (!validationSchema) {
      onSubmit(formValue.value as T)
      return
    }
    const currentValidationSchema = typeof validationSchema === "function" ? validationSchema(formValue.value) : validationSchema
    await validateAndSave(formValue.value, currentValidationSchema, errors, () => {
      onSubmit(formValue.value as T)
    })
  }

  return {
    onFormSubmit,
    resetToInitialValue,
    isFormValueChanged,
    formValue,
    errors,
  }
}
