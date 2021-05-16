import {
  binomial,
  cumulativeSuccess,
  pR,
  pS,
  combinations,
  sortedCombinations,
  funcSum,
  subsets,
  skilledCombinations,
  uniqueSkilledCombinations,
  distinctPermutationsCount,
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

test("distinctPermutationsCount", () => {
  expect(distinctPermutationsCount([1])).toStrictEqual(1);
  expect(distinctPermutationsCount([1, 1])).toStrictEqual(1);
  expect(distinctPermutationsCount([1, 1, 2])).toStrictEqual(3);
  expect(distinctPermutationsCount([1, 1, 2, 2])).toStrictEqual(6);
  expect(distinctPermutationsCount([1, 2, 3])).toStrictEqual(6);
});

describe("funcSum", () => {
  test("x2", () => {
    expect(funcSum({ func: (x) => 2 * x, n: 3 })).toStrictEqual(12);
    expect(funcSum({ func: (x) => 2 * x, n: 1, i: 0 })).toStrictEqual(2);
    expect(funcSum({ func: (x) => 2 * x, n: 1, i: 2 })).toStrictEqual(0);
  });
  test("square", () => {
    expect(funcSum({ func: (x) => Math.pow(x, 2), n: 3 })).toStrictEqual(14);
    expect(funcSum({ func: (x) => Math.pow(x, 2), n: 3, i: 2 })).toStrictEqual(
      13
    );
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

describe("subsets", () => {
  test("size = 1", () => {
    expect(subsets({ ring: 1, skill: 0, size: 1 })).toStrictEqual([
      { ring: 1, skill: 0 },
    ]);
    expect(subsets({ ring: 3, skill: 0, size: 1 })).toStrictEqual([
      { ring: 1, skill: 0 },
    ]);
    expect(subsets({ ring: 1, skill: 1, size: 1 })).toStrictEqual([
      { ring: 1, skill: 0 },
      { ring: 0, skill: 1 },
    ]);
    expect(subsets({ ring: 2, skill: 1, size: 1 })).toStrictEqual([
      { ring: 1, skill: 0 },
      { ring: 0, skill: 1 },
    ]);
    expect(subsets({ ring: 2, skill: 3, size: 1 })).toStrictEqual([
      { ring: 1, skill: 0 },
      { ring: 0, skill: 1 },
    ]);
  });
  test("size = 2", () => {
    expect(subsets({ ring: 2, skill: 2, size: 2 })).toStrictEqual([
      { ring: 2, skill: 0 },
      { ring: 1, skill: 1 },
      { ring: 0, skill: 2 },
    ]);
  });
  test("size = 3", () => {
    expect(subsets({ ring: 2, skill: 3, size: 3 })).toStrictEqual([
      { ring: 2, skill: 1 },
      { ring: 1, skill: 2 },
      { ring: 0, skill: 3 },
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

describe("skilledCombinations", () => {
  test("n = 1", () => {
    expect(skilledCombinations({ ring: 1, skill: 1, n: 1 })).toStrictEqual([
      { rings: [1], skills: [] },
      { rings: [], skills: [1] },
    ]);
    expect(skilledCombinations({ ring: 2, skill: 3, n: 1 })).toStrictEqual([
      { rings: [1], skills: [] },
      { rings: [], skills: [1] },
    ]);
  });
  test("n = 2", () => {
    expect(skilledCombinations({ ring: 1, skill: 3, n: 2 })).toStrictEqual([
      { rings: [2], skills: [] },
      { rings: [], skills: [2] },
    ]);
    expect(skilledCombinations({ ring: 2, skill: 1, n: 2 })).toStrictEqual([
      { rings: [1, 1], skills: [] },
      { rings: [1], skills: [1] },
      { rings: [2], skills: [] },
      { rings: [], skills: [2] },
    ]);
    expect(skilledCombinations({ ring: 2, skill: 3, n: 2 })).toStrictEqual([
      { rings: [1, 1], skills: [] },
      { rings: [1], skills: [1] },
      { rings: [], skills: [1, 1] },
      { rings: [2], skills: [] },
      { rings: [], skills: [2] },
    ]);
  });
  test("n = 5", () => {
    expect(skilledCombinations({ ring: 1, skill: 3, n: 5 })).toStrictEqual([
      { rings: [5], skills: [] },
      { rings: [], skills: [5] },
    ]);
    expect(skilledCombinations({ ring: 2, skill: 3, n: 5 })).toStrictEqual([
      { rings: [1, 4], skills: [] },
      { rings: [1], skills: [4] },
      { rings: [], skills: [1, 4] },
      { rings: [2, 3], skills: [] },
      { rings: [2], skills: [3] },
      { rings: [], skills: [2, 3] },
      { rings: [3, 2], skills: [] },
      { rings: [3], skills: [2] },
      { rings: [], skills: [3, 2] },
      { rings: [4, 1], skills: [] },
      { rings: [4], skills: [1] },
      { rings: [], skills: [4, 1] },
      { rings: [5], skills: [] },
      { rings: [], skills: [5] },
    ]);
  });
});

describe("uniqueSkilledCombinations", () => {
  test("n = 5", () => {
    expect(
      uniqueSkilledCombinations({ ring: 2, skill: 3, n: 5 })
    ).toStrictEqual([
      { rings: [1, 4], skills: [] },
      { rings: [1], skills: [4] },
      { rings: [], skills: [1, 4] },
      { rings: [2, 3], skills: [] },
      { rings: [2], skills: [3] },
      { rings: [], skills: [2, 3] },
      { rings: [3], skills: [2] },
      { rings: [4], skills: [1] },
      { rings: [5], skills: [] },
      { rings: [], skills: [5] },
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

  describe("with skill", () => {
    describe("simple cases", () => {
      test("tn = 1", () => {
        expect(cumulativeSuccess({ ring: 1, skill: 1, tn: 1 })).toBeCloseTo(
          0.7917,
          4
        );
        expect(cumulativeSuccess({ ring: 2, skill: 1, tn: 1 })).toBeCloseTo(
          0.8958,
          4
        );
        expect(cumulativeSuccess({ ring: 1, skill: 2, tn: 1 })).toBeCloseTo(
          0.9132,
          4
        );
        expect(cumulativeSuccess({ ring: 2, skill: 2, tn: 1 })).toBeCloseTo(
          0.9566,
          4
        );
      });
      describe("ring = 1", () => {
        test("tn = 2", () => {
          expect(cumulativeSuccess({ ring: 1, skill: 1, tn: 2 })).toBeCloseTo(
            0.1725,
            4
          );
          expect(cumulativeSuccess({ ring: 1, skill: 2, tn: 2 })).toBeCloseTo(
            0.2529,
            4
          );
          expect(cumulativeSuccess({ ring: 1, skill: 3, tn: 2 })).toBeCloseTo(
            0.3255,
            4
          );
          expect(cumulativeSuccess({ ring: 1, skill: 4, tn: 2 })).toBeCloseTo(
            0.3911,
            4
          );
        });
        test("tn = 3", () => {
          expect(cumulativeSuccess({ ring: 1, skill: 1, tn: 3 })).toBeCloseTo(
            0.0299,
            4
          );
          expect(cumulativeSuccess({ ring: 1, skill: 2, tn: 3 })).toBeCloseTo(
            0.0456,
            4
          );
          expect(cumulativeSuccess({ ring: 1, skill: 3, tn: 3 })).toBeCloseTo(
            0.0611,
            4
          );
        });
        test("tn = 4", () => {
          expect(cumulativeSuccess({ ring: 1, skill: 1, tn: 4 })).toBeCloseTo(
            0.005,
            4
          );
          expect(cumulativeSuccess({ ring: 1, skill: 2, tn: 4 })).toBeCloseTo(
            0.0077,
            4
          );
          expect(cumulativeSuccess({ ring: 1, skill: 3, tn: 4 })).toBeCloseTo(
            0.0104,
            4
          );
        });
        test("tn = 5", () => {
          expect(cumulativeSuccess({ ring: 1, skill: 6, tn: 5 })).toBeCloseTo(
            0.0031,
            4
          );
        });
      });
    });
    describe("tn = 2", () => {
      test("ring = 2", () => {
        expect(cumulativeSuccess({ ring: 2, skill: 1, tn: 2 })).toBeCloseTo(
          0.6007,
          4
        );
        expect(cumulativeSuccess({ ring: 2, skill: 2, tn: 2 })).toBeCloseTo(
          0.783,
          4
        );
        expect(cumulativeSuccess({ ring: 2, skill: 3, tn: 2 })).toBeCloseTo(
          0.8885,
          4
        );
      });
      test("ring = 3", () => {
        expect(cumulativeSuccess({ ring: 3, skill: 1, tn: 2 })).toBeCloseTo(
          0.7569,
          4
        );
        expect(cumulativeSuccess({ ring: 3, skill: 2, tn: 2 })).toBeCloseTo(
          0.8734,
          4
        );
        expect(cumulativeSuccess({ ring: 3, skill: 3, tn: 2 })).toBeCloseTo(
          0.9367,
          4
        );
      });
    });
    describe("tn = 3", () => {
      test("ring = 2", () => {
        expect(cumulativeSuccess({ ring: 2, skill: 1, tn: 3 })).toBeCloseTo(
          0.1922,
          4
        );
        expect(cumulativeSuccess({ ring: 2, skill: 2, tn: 3 })).toBeCloseTo(
          0.2862,
          4
        );
        expect(cumulativeSuccess({ ring: 2, skill: 3, tn: 3 })).toBeCloseTo(
          0.3662,
          4
        );
        expect(cumulativeSuccess({ ring: 2, skill: 4, tn: 3 })).toBeCloseTo(
          0.4339,
          4
        );
      });
      test("ring = 3", () => {
        expect(cumulativeSuccess({ ring: 3, skill: 1, tn: 3 })).toBeCloseTo(
          0.4647,
          4
        );
        expect(cumulativeSuccess({ ring: 3, skill: 2, tn: 3 })).toBeCloseTo(
          0.6546,
          4
        );
        expect(cumulativeSuccess({ ring: 3, skill: 4, tn: 3 })).toBeCloseTo(
          0.8822,
          4
        );
      });
      test("ring = 4", () => {
        expect(cumulativeSuccess({ ring: 4, skill: 3, tn: 3 })).toBeCloseTo(
          0.8694,
          4
        );
      });
    });
    describe("tn = 4", () => {
      test("ring = 2", () => {
        expect(cumulativeSuccess({ ring: 2, skill: 1, tn: 4 })).toBeCloseTo(
          0.0502,
          4
        );
        expect(cumulativeSuccess({ ring: 2, skill: 2, tn: 4 })).toBeCloseTo(
          0.0837,
          4
        );
        expect(cumulativeSuccess({ ring: 2, skill: 3, tn: 4 })).toBeCloseTo(
          0.119,
          4
        );
      });
    });
    describe("tn = 5", () => {
      test("ring = 2", () => {
        expect(cumulativeSuccess({ ring: 2, skill: 1, tn: 5 })).toBeCloseTo(
          0.0115,
          4
        );
      });
    });
  });
});
