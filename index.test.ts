import { createValue } from "./index";

type MeasurementOptions = {
  magnitude: number;
  unit: "cm" | "ft";
};

const defaults = { magnitude: undefined, unit: "cm" as "cm" };
const Measurement = createValue<MeasurementOptions, typeof defaults>(defaults);

describe("Measurement", () => {
  it("allows creating instance", () => {
    const measurement = Measurement({ magnitude: 100, unit: "cm" });
    expect(measurement.magnitude).toEqual(100);
    expect(measurement.unit).toEqual("cm");
  });

  it("two instances with same values are equal", () => {
    const measurement = Measurement({ magnitude: 100, unit: "cm" });
    const measurement2 = Measurement({ magnitude: 100, unit: "cm" });

    expect(measurement).toEqual(measurement2);
  });

  it("two instances with different values are not equal", () => {
    const measurement = Measurement({ magnitude: 100, unit: "cm" });
    const measurement2 = Measurement({ magnitude: 200, unit: "ft" });

    expect(measurement).not.toEqual(measurement2);
  });

  it("creating instance with builder is the same as creating from scratch", () => {
    const measurement = Measurement({ magnitude: 100, unit: "cm" });
    const measurement2 = Measurement({ magnitude: 200, unit: "ft" })
      .toBuilder()
      .magnitude(100)
      .unit("cm")
      .build();

    expect(measurement).toEqual(measurement2);
  });

  it("does not permit setting attributes directly", () => {
    const measurement = Measurement({ magnitude: 100, unit: "cm" });
    expect(() => {
      // @ts-expect-error Properties should not be assignable
      measurement.magnitude = 200;
    }).toThrowErrorMatchingInlineSnapshot(
      `"Cannot assign to read only property 'magnitude' of object '#<Object>'"`
    );
  });

  it("provides helpful string output", () => {
    const measurement = Measurement({ magnitude: 100, unit: "cm" });
    expect(measurement).toMatchInlineSnapshot(`
      Object {
        "magnitude": 100,
        "unit": "cm",
      }
    `);
  });

  it("uses defaults if property is not specified", () => {
    const measurement = Measurement({ magnitude: 100 });
    expect(measurement).toEqual(Measurement({ magnitude: 100, unit: "cm" }));
  });

  it("throws type error if required property is not specified", () => {
    // @ts-expect-error should complain about missing magnitude
    const measurement = Measurement({ unit: "cm" });
  });
});
