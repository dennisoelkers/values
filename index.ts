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

type UndefinedKeys<T, D extends Defaults<T>> = { [Key in keyof T]-?: D[Key] extends undefined ? Key : never }[keyof T];

type DefinedKeys<T, D extends Defaults<T>> = { [Key in keyof T]-?: D[Key] extends undefined ? never : Key }[keyof T];

export const createValue = <T, D extends Defaults<T>, JSON = T>(defaults: D, toJSON?: (value: T) => JSON) => {
  function _Value(props: Partial<Pick<T, DefinedKeys<T, D>>> & Pick<T, UndefinedKeys<T, D>>): ValueObject<T> {
    const value = { ...defaults, ...props } as T;
    const Value = {
      toBuilder: () => builder(defaults, value, _Value),
      toJSON: () => (toJSON ? toJSON(value) : value),
    };
    return Object.freeze(Object.setPrototypeOf(value, Value));
  }

  return _Value;
};
