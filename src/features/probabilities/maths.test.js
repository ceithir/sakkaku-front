import {
  binomial,
  cumulativeSuccess,
  pR,
  pS,
  combinations,
  sortedCombinations,
} from "./maths";

/**
 * Probabilities checked for consistency against empirical results from https://l5r-dice-sim.vercel.app/
 */

describe("die", () => {
  test("ring", () => {
    expect(pR(0)).toStrictEqual(0.5);
    expect(pR(1)).toBeCloseTo(0.4167, 4);
    expect(pR(2)).toBeCloseTo(0.0694, 4);
    expect(pR(3)).toBeCloseTo(0.0116, 4);
  });
  test("skill", () => {
    expect(pS(0)).toStrictEqual(5 / 12);
    expect(pS(1)).toBeCloseTo(0.4861, 4);
    expect(pS(2)).toBeCloseTo(0.081, 4);
    expect(pS(3)).toBeCloseTo(0.0135, 4);
  });
});

describe("binomial", () => {
  test("n = 1", () => {
    expect(binomial(1, 1)).toStrictEqual(1);
  });
  test("n = 2", () => {
    expect(binomial(2, 1)).toStrictEqual(2);
    expect(binomial(2, 2)).toStrictEqual(1);
  });
  test("n = 3", () => {
    expect(binomial(3, 1)).toStrictEqual(3);
    expect(binomial(3, 2)).toStrictEqual(3);
    expect(binomial(3, 3)).toStrictEqual(1);
  });
  test("n = 4", () => {
    expect(binomial(4, 1)).toStrictEqual(4);
    expect(binomial(4, 2)).toStrictEqual(6);
    expect(binomial(4, 3)).toStrictEqual(4);
    expect(binomial(4, 4)).toStrictEqual(1);
  });
});

describe("combinations", () => {
  test("n = 1", () => {
    expect(combinations(1)).toStrictEqual([[1]]);
  });
  test("n = 2", () => {
    expect(combinations(2)).toStrictEqual([[1, 1], [2]]);
  });
  test("n = 3", () => {
    expect(combinations(3)).toStrictEqual([[1, 1, 1], [1, 2], [2, 1], [3]]);
  });
  test("n = 4", () => {
    expect(combinations(4)).toStrictEqual([
      [1, 1, 1, 1],
      [1, 1, 2],
      [1, 2, 1],
      [1, 3],
      [2, 1, 1],
      [2, 2],
      [3, 1],
      [4],
    ]);
    expect(combinations(4, { maxCardinality: 2 })).toStrictEqual([
      [1, 3],
      [2, 2],
      [3, 1],
      [4],
    ]);
  });
});

describe("sortedCombinations", () => {
  test("n = 1", () => {
    expect(sortedCombinations(1)).toStrictEqual([{ value: [1], count: 1 }]);
  });
  test("n = 2", () => {
    expect(sortedCombinations(2)).toStrictEqual([
      { value: [1, 1], count: 1 },
      { value: [2], count: 1 },
    ]);
  });
  test("n = 3", () => {
    expect(sortedCombinations(3)).toStrictEqual([
      { value: [1, 1, 1], count: 1 },
      { value: [1, 2], count: 2 },
      { value: [3], count: 1 },
    ]);
  });
  test("n = 4", () => {
    expect(sortedCombinations(4)).toStrictEqual([
      { value: [1, 1, 1, 1], count: 1 },
      { value: [1, 1, 2], count: 3 },
      { value: [1, 3], count: 2 },
      { value: [2, 2], count: 1 },
      { value: [4], count: 1 },
    ]);
  });
});

describe("cumulativeSuccess", () => {
  test("edge cases", () => {
    expect(cumulativeSuccess({ ring: 2, skill: 2, tn: 0 })).toStrictEqual(1);
    expect(cumulativeSuccess({ ring: 0, skill: 2, tn: 0 })).toStrictEqual(1);
    expect(cumulativeSuccess({ ring: 0, skill: 2, tn: 1 })).toStrictEqual(0);
  });

  describe("ring only", () => {
    test("tn = 1", () => {
      expect(cumulativeSuccess({ ring: 1, skill: 0, tn: 1 })).toStrictEqual(
        0.5
      );
      expect(cumulativeSuccess({ ring: 2, skill: 0, tn: 1 })).toStrictEqual(
        0.75
      );
      expect(cumulativeSuccess({ ring: 3, skill: 0, tn: 1 })).toStrictEqual(
        0.875
      );
    });

    test("tn = 2", () => {
      expect(cumulativeSuccess({ ring: 1, skill: 0, tn: 2 })).toBeCloseTo(
        0.0833,
        4
      );
      expect(cumulativeSuccess({ ring: 2, skill: 0, tn: 2 })).toBeCloseTo(
        0.3333,
        4
      );
      expect(cumulativeSuccess({ ring: 3, skill: 0, tn: 2 })).toBeCloseTo(
        0.5625,
        4
      );
    });

    test("tn = 3", () => {
      expect(cumulativeSuccess({ ring: 1, skill: 0, tn: 3 })).toBeCloseTo(
        0.0139,
        4
      );
      expect(cumulativeSuccess({ ring: 2, skill: 0, tn: 3 })).toBeCloseTo(
        0.0903,
        4
      );
      expect(cumulativeSuccess({ ring: 3, skill: 0, tn: 3 })).toBeCloseTo(
        0.25,
        4
      );
      expect(cumulativeSuccess({ ring: 4, skill: 0, tn: 3 })).toBeCloseTo(
        0.434,
        4
      );
    });

    test("tn = 4", () => {
      expect(cumulativeSuccess({ ring: 1, skill: 0, tn: 4 })).toBeCloseTo(
        0.0023,
        4
      );
      expect(cumulativeSuccess({ ring: 2, skill: 0, tn: 4 })).toBeCloseTo(
        0.0208,
        4
      );
      expect(cumulativeSuccess({ ring: 3, skill: 0, tn: 4 })).toBeCloseTo(
        0.0822,
        4
      );
      expect(cumulativeSuccess({ ring: 4, skill: 0, tn: 4 })).toBeCloseTo(
        0.1968,
        4
      );
      expect(cumulativeSuccess({ ring: 5, skill: 0, tn: 4 })).toBeCloseTo(
        0.343,
        4
      );
    });

    test("tn = 5", () => {
      expect(cumulativeSuccess({ ring: 1, skill: 0, tn: 5 })).toBeCloseTo(
        0.0004,
        4
      );
      expect(cumulativeSuccess({ ring: 2, skill: 0, tn: 5 })).toBeCloseTo(
        0.0044,
        4
      );
      expect(cumulativeSuccess({ ring: 3, skill: 0, tn: 5 })).toBeCloseTo(
        0.0229,
        4
      );
      expect(cumulativeSuccess({ ring: 4, skill: 0, tn: 5 })).toBeCloseTo(
        0.0716,
        4
      );
      expect(cumulativeSuccess({ ring: 5, skill: 0, tn: 5 })).toBeCloseTo(
        0.1586,
        4
      );
      expect(cumulativeSuccess({ ring: 6, skill: 0, tn: 5 })).toBeCloseTo(
        0.2758,
        4
      );
    });

    test("tn = 6", () => {
      expect(cumulativeSuccess({ ring: 1, skill: 0, tn: 6 })).toBeCloseTo(
        0.0001,
        4
      );
      expect(cumulativeSuccess({ ring: 2, skill: 0, tn: 6 })).toBeCloseTo(
        0.0009,
        4
      );
      expect(cumulativeSuccess({ ring: 3, skill: 0, tn: 6 })).toBeCloseTo(
        0.0057,
        4
      );
      expect(cumulativeSuccess({ ring: 4, skill: 0, tn: 6 })).toBeCloseTo(
        0.0224,
        4
      );
      expect(cumulativeSuccess({ ring: 5, skill: 0, tn: 6 })).toBeCloseTo(
        0.0615,
        4
      );
      expect(cumulativeSuccess({ ring: 6, skill: 0, tn: 6 })).toBeCloseTo(
        0.1296,
        4
      );
      expect(cumulativeSuccess({ ring: 7, skill: 0, tn: 6 })).toBeCloseTo(
        0.2246,
        4
      );
    });
  });
});
