import { parse } from "./formula";

describe("parse", () => {
  test("empty", () => {
    expect(parse()).toEqual(false);
    expect(parse("")).toEqual(false);
  });
  test("simple", () => {
    expect(parse("3k2")).toEqual({ roll: 3, keep: 2, modifier: 0 });
  });
  test("alltogether", () => {
    expect(parse("3k2+5+2k0-1k1-2+4k0")).toEqual({
      roll: 8,
      keep: 1,
      modifier: 3,
    });
  });

  describe("addition", () => {
    test("simple", () => {
      expect(parse("3k2+2k1")).toEqual({ roll: 5, keep: 3, modifier: 0 });
    });
    test("multiple", () => {
      expect(parse("3k2+2k1+3k0")).toEqual({ roll: 8, keep: 3, modifier: 0 });
    });
    test("substraction", () => {
      expect(parse("5k2-1k0")).toEqual({ roll: 4, keep: 2, modifier: 0 });
    });
    test("add and substract", () => {
      expect(parse("5k2+3k2-1k0")).toEqual({ roll: 7, keep: 4, modifier: 0 });
    });
  });

  describe("modifier", () => {
    test("simple", () => {
      expect(parse("3k2+5")).toEqual({ roll: 3, keep: 2, modifier: 5 });
    });
    test("negative", () => {
      expect(parse("3k2-2")).toEqual({ roll: 3, keep: 2, modifier: -2 });
    });
    test("addition", () => {
      expect(parse("3k2+3-2+5")).toEqual({ roll: 3, keep: 2, modifier: 6 });
    });
  });
});
