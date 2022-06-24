# Values
Simple, typed, immutable value classes/records for TS.

The goal is to have:

  - Simple definition of a value's schema
  - Full Immutability
  - Being able to provide default values
  - Builders on the value class's instances
  - Full typing for getters/builder setters
  - Per-class customization of JSON serialization/deserialization
  
  
## Example

```TypeScript
type MeasurementOptions = {
  magnitude: number;
  unit: 'cm' | 'ft';
};

const defaults = { magnitude: undefined, unit: 'cm' as 'cm' };
const Measurement = createValue<MeasurementOptions, typeof defaults>(defaults);

const measurement = Measurement({ magnitude: 100, unit: 'cm' });
const measurement2 = measurement.toBuilder().magnitude(200).unit('ft').build();
```
