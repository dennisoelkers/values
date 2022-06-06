type Builder<T> = Readonly<{ [key in keyof T]: (value: T[key]) => Builder<T> } & { build: () => ValueObject<T> }>;

type ValueObject<T> = Readonly<T & { toBuilder: () => Builder<T> }>;

const builder = <T>(defaults: Defaults<T>, obj: T, factory: (v: T) => ValueObject<T>): Builder<T> => {
  const _builder = Object.keys(defaults)
    .map((prop) => ({
      get [prop]() {
        return (value: any) => builder<T>(defaults, { ...obj, [prop]: value }, factory);
      },
    }))
    .reduce((prev, cur) => ({ ...prev, ...cur }), {});

  return Object.freeze({
    ...(_builder as {
      [key in keyof T]: (value: T[key]) => Builder<T>;
    }),
    build: () => factory(obj),
  });
};

type Defaults<T> = { [key in keyof T]: T[key] | undefined };

type UndefinedKeys<T> = { [P in keyof T]: T[P] extends typeof undefined ? P : never }[keyof T];
type DefinedKeys<T> = { [P in keyof T]: T[P] extends typeof undefined ? never : P }[keyof T];

type RequiredKeys<T, U extends keyof T> = Pick<T, U>;
type OptionalKeys<T, U extends keyof T> = { [P in keyof Pick<T, U>]?: T[P] };

export const createValue = <T, D extends { [key in keyof T]: any }, JSON = T>(
  defaults: D,
  toJSON?: (value: T) => JSON
) => {
  // @ts-ignore
  function _Value(props: RequiredKeys<T, UndefinedKeys<D>> & OptionalKeys<T, DefinedKeys<D>>): ValueObject<T> {
    const value = { ...defaults, ...props };
    const Value = {
      // @ts-ignore
      toBuilder: () => builder(defaults, value, _Value),
      toJSON: () => (toJSON ? toJSON(value) : value),
    };
    return Object.freeze(Object.setPrototypeOf(value, Value));
  }

  return _Value;
};
