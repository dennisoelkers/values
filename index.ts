type Builder<T> = Readonly<{ [key in keyof T]: (value: T[key]) => Builder<T> } & { build: () => ValueObject<T> }>;

type ValueObject<T> = Readonly<T & { toBuilder: () => Builder<T> }>;

const builder = <T>(defaults: Defaults<T>, obj: T, factory: (v: T) => ValueObject<T>): Builder<T> => {
  // @ts-ignore
  const _builder: {
    [key in keyof T]: (value: T[key]) => Builder<T>
  } = Object.keys(defaults).map(prop => ({
    get [prop]() {
      return (value: any) => builder<T>(defaults, { ...obj, [prop]: value }, factory);
    }
  }))
    .reduce((prev, cur) => ({ ...prev, ...cur }), {});
  
  return Object.freeze({
    ..._builder,
    build: () => factory(obj),
  });
};


type Defaults<T> = { [key in keyof T]: T[key] | undefined };

type UndefinedKeys<T> = { [P in keyof T]: T[P] extends typeof undefined ? P : never }[keyof T];
type DefinedKeys<T> = { [P in keyof T]: T[P] extends typeof undefined ? never : P }[keyof T];

type RequiredKeys<T, U extends keyof T> = Pick<T, U>;
type OptionalKeys<T, U extends keyof T> = { [P in keyof Pick<T, U>]?: T[P] }

type MeasurementOptions = {
  magnitude: number,
  unit: 'cm' | 'ft',
};

const MD = { magnitude: undefined, unit: 'cm' };
type MeasurementDefaults = typeof MD;

type Foo = DefinedKeys<MeasurementDefaults>;
type Bar = UndefinedKeys<MeasurementDefaults>;
type Defaultized = RequiredKeys<MeasurementOptions, UndefinedKeys<MeasurementDefaults>> & OptionalKeys<MeasurementOptions, DefinedKeys<MeasurementDefaults>>;

export const createValue = <T, D extends { [key in keyof T]: any }>(defaults: D) => {
  // @ts-ignore
  function _Value(props: RequiredKeys<T, UndefinedKeys<D>> & OptionalKeys<T, DefinedKeys<D>>): ValueObject<T> {
    const value = Object.assign({}, defaults, props);
    const Value = {
      toBuilder: () => builder(defaults, value, _Value),
    };
    Object.setPrototypeOf(value, Value);
    // @ts-ignore
    return Object.freeze(value);
  }
  
  return _Value;
};

