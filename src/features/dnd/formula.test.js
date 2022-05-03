import { parse, stringify } from "./formula";

describe("parse", () => {
  test("empty", () => {
    expect(parse()).toEqual(false);
    expect(parse("")).toEqual(false);
  });
  test("simple", () => {
    expect(parse("2d6")).toEqual({
      dices: [{ sides: 6, number: 2 }],
      modifier: 0,
    });
  });
  test("modifier", () => {
    expect(parse("1d12+3")).toEqual({
      dices: [{ sides: 12, number: 1 }],
      modifier: 3,
    });
    expect(parse("3d10-5")).toEqual({
      dices: [{ sides: 10, number: 3 }],
      modifier: -5,
    });
  });
  test("exclude zero", () => {
    expect(parse("0d12")).toEqual(false);
    expect(parse("3d0")).toEqual(false);
    expect(parse("0d0")).toEqual(false);
  });
  test("modifier addition", () => {
    expect(parse("1d20+3-2+4")).toEqual({
      dices: [{ sides: 20, number: 1 }],
      modifier: 5,
    });
  });
  test("multiple dice type", () => {
    expect(parse("1d20+3d6")).toEqual({
      dices: [
        { sides: 20, number: 1 },
        { sides: 6, number: 3 },
      ],
      modifier: 0,
    });
  });
});

describe("stringify", () => {
  test("one type, no modifier", () => {
    expect(
      stringify({
        dices: [{ sides: 6, number: 3 }],
      })
    ).toBe("3d6");
  });
});
