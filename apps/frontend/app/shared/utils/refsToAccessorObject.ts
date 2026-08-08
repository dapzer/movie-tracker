import type { ModelRef, Ref } from "vue"

type UnwrapRefs<T extends Record<string, Ref<any>>> = {
  [K in keyof T]: T[K] extends Ref<infer V> ? V : never
}

/**
 * Takes a record of Vue Ref / ModelRef instances and returns a plain object
 * with JS getter/setter property accessors that transparently read and write
 * the underlying `.value` of each ref.
 *
 * Useful for adapting defineModel refs into the shape expected by UiFilters v-model:
 *
 * @example
 * const filtersModel = computed(() =>
 *   refsToAccessorObject({ mediaTypes: mediaTypesModel, rating: ratingModel }),
 * )
 */
export function refsToAccessorObject<T extends Record<string, ModelRef<any>>>(
  models: T,
): UnwrapRefs<T> {
  const result = {} as UnwrapRefs<T>

  for (const [key, model] of Object.entries(models)) {
    Object.defineProperty(result, key, {
      get: () => model.value,
      set: (value: typeof model.value) => {
        model.value = value
      },
      enumerable: true,
    })
  }

  return result
}
