/**
 * Mathematical concepts:
 * https://en.wikipedia.org/wiki/Combination
 * https://en.wikipedia.org/wiki/Permutation
 * https://en.wikipedia.org/wiki/Geometric_progression
 */

/**
 * Known issues:
 * - Probabilities were checked for consistency in the generic case against the empirical results from https://l5r-dice-sim.vercel.app/ so any bias from this one is also reflected there
 * - Nothing has been done to avoid rounding errors piling up
 * - The maths are done as if the dice exploded before being chosen to be kept
 */

export const permutationsCount = (list) => {
  let distincts = {};
  list.forEach((value) => {
    if (distincts[value]) {
      distincts[value] += 1;
    } else {
      distincts[value] = 1;
    }
  });

  return (
    factorial(list.length) /
    Object.values(distincts).reduce((acc, value) => {
      return acc * factorial(value);
    }, 1)
  );
};

const factorial = (n) => {
  if (n < 0) {
    throw new Error("n must be >= 0");
  }
  if (n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
};

/**
 * Chances to get _exactly_ n success out of a given ring die
 */
export const pRDefault = (n) => {
  if (n === 0) {
    return 1 / 2;
  }

  return Math.pow(1 / 6, n - 1) * (1 / 3 + (1 / 6) * (1 / 2));
};

/**
 * Chances to get _exactly_ n success out of a given skill die
 */
export const pSDefault = (n) => {
  if (n === 0) {
    return 5 / 12;
  }

  return Math.pow(1 / 6, n - 1) * (5 / 12 + (1 / 6) * (5 / 12));
};

/**
 * Chances to get _exactly_ n success out of a given ring die while compromised
 */
export const pRCompromised = (n) => {
  if (n === 0) {
    return 5 / 6;
  }
  if (n === 1) {
    return 1 / 6;
  }
  return 0;
};

/**
 * Chances to get _exactly_ n success out of a given skill die while compromised
 */
export const pSCompromised = (n) => {
  if (n === 0) {
    return 2 / 3;
  }
  return Math.pow(1 / 12, n - 1) * (1 / 4 + (1 / 12) * (2 / 3));
};

/**
 * List all permutations of non-zero positive integers that sum up to n
 * Example:
 * n=4 -> [
      [1, 1, 1, 1],
      [1, 1, 2],
      [1, 2, 1],
      [1, 3],
      [2, 1, 1],
      [2, 2],
      [3, 1],
      [4],
    ]
 */
export const permutations = (n, options = {}) => {
  const { maxCardinality = null, maxValue = null } = options;

  let storage = [];

  const findPermutations = (candidate) => {
    if (maxCardinality !== null && candidate.length > maxCardinality) {
      return;
    }
    if (maxValue !== null && candidate.some((value) => value > maxValue)) {
      return;
    }

    const total = candidate.reduce((acc, val) => acc + val, 0);
    if (total < n) {
      const newCandidateA = [...candidate, 1];
      const newCandidateB = [...candidate];
      newCandidateB[newCandidateB.length - 1] =
        newCandidateB[newCandidateB.length - 1] + 1;
      findPermutations(newCandidateA);
      findPermutations(newCandidateB);
    }
    if (total === n) {
      storage.push(candidate);
    }
  };

  findPermutations([1]);
  return storage;
};

/**
 * List all ways pick {size} dice out of a pool of {ring} ring dice and {skill} skill dice
 * Example:
 * ring=2, skill=3, size=3 -> [
      { ring: 2, skill: 1 },
      { ring: 1, skill: 2 },
      { ring: 0, skill: 3 },
    ]
 */
export const subsets = ({ ring, skill, size }) => {
  if (size > ring.length + skill.length) {
    throw new Error("Out of bounds");
  }
  if (ring < 1) {
    throw new Error("Not possible for a standard roll thus not implemented");
  }

  let storage = [];
  const rec = (candidate) => {
    if (candidate.length < size) {
      if (candidate.filter((x) => x === "r").length < ring) {
        rec([...candidate, "r"]);
      }
      if (candidate.filter((x) => x === "s").length < skill) {
        rec([...candidate, "s"]);
      }
    }
    if (candidate.length === size) {
      storage.push(candidate);
    }
  };
  rec([]);

  return arrayUnique(storage.map((a) => [...a].sort())).map((value) => {
    const r = value.filter((x) => x === "r").length;
    const s = value.filter((x) => x === "s").length;

    return {
      ring: r,
      skill: s,
    };
  });
};

/**
 * List all permutations of {keptDiceCount} dice among a pool of {ring} ring dice plus {skill} skill dice summing up to n
 * Example:
 * ring=2, skill=3, n=5 -> [
    { rings: [ 1, 4 ], skills: [] },
    { rings: [ 1 ], skills: [ 4 ] },
    { rings: [], skills: [ 1, 4 ] },
    { rings: [ 2, 3 ], skills: [] },
    { rings: [ 2 ], skills: [ 3 ] },
    { rings: [], skills: [ 2, 3 ] },
    { rings: [ 3, 2 ], skills: [] },
    { rings: [ 3 ], skills: [ 2 ] },
    { rings: [], skills: [ 3, 2 ] },
    { rings: [ 4, 1 ], skills: [] },
    { rings: [ 4 ], skills: [ 1 ] },
    { rings: [], skills: [ 4, 1 ] },
    { rings: [ 5 ], skills: [] },
    { rings: [], skills: [ 5 ] }
   ]
 */
export const ringSkillPermutations = ({
  ring,
  skill,
  n,
  keptDiceCount = ring,
}) => {
  const combs = permutations(n, { maxCardinality: keptDiceCount });

  let result = [];
  combs.forEach((comb) => {
    const sets = subsets({ ring, skill, size: comb.length });
    sets.forEach(({ ring: r, skill: s }) => {
      let rings = new Array(r);
      let skills = new Array(s);

      for (let i = 0; i < r; i++) {
        rings[i] = comb[i];
      }
      for (let i = 0; i < s; i++) {
        skills[i] = comb[r + i];
      }

      result.push({ rings, skills });
    });
  });

  return result;
};

/**
 * List all permutations of {keptDiceCount} dice among a pool of {ring} ring dice plus {skill} skill dice summing up to n
 * ring=2, skill=3, n=5 -> [
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
    ]
 */
export const ringSkillCombinations = ({ ring, skill, n, keptDiceCount }) => {
  const array = ringSkillPermutations({ ring, skill, n, keptDiceCount }).map(
    ({ rings, skills }) => {
      return { rings: rings.sort(), skills: skills.sort() };
    }
  );

  let result = [];
  let duplicatesIndex = [];
  for (let i = 0; i < array.length; i++) {
    if (duplicatesIndex.includes(i)) {
      continue;
    }
    for (let j = i + 1; j < array.length; j++) {
      if (
        sameArray(array[i]["rings"], array[j]["rings"]) &&
        sameArray(array[i]["skills"], array[j]["skills"])
      ) {
        duplicatesIndex.push(j);
      }
    }
    result.push(array[i]);
  }

  return result;
};

/**
 * List all combinations between of {size} integers between 0 and {threshold}
 * threshold=2, size=2 -> [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 1],
    [1, 2],
    [2, 2],
  ]
 *
 * See discussion on algorithm here: https://stackoverflow.com/questions/127704/algorithm-to-return-all-combinations-of-k-elements-from-n
 *
 * Note: size=0 will return [[]]
 */
export const complementaryCombinations = ({ threshold, size }) => {
  let resultPerSize = {};

  resultPerSize[1] = [];
  for (let i = 1; i <= threshold; i++) {
    resultPerSize[1].push([i]);
  }

  for (let s = 2; s <= size; s++) {
    resultPerSize[s] = [];
    for (let i = 1; i <= threshold; i++) {
      for (let j = 0; j < resultPerSize[s - 1].length; j++) {
        if (resultPerSize[s - 1][j][0] < i) {
          continue;
        }
        resultPerSize[s].push([i, ...resultPerSize[s - 1][j]]);
      }
    }
  }

  let result = [new Array(size).fill(0)];
  for (let i = 1; i <= size; i++) {
    resultPerSize[i].forEach((r) => {
      result.push([...new Array(size - i).fill(0), ...r]);
    });
  }

  return result;
};

/**
 * As the name suggests, list all possible permutations
 * Not used by the the algorithm, just there for testing/debugging
 */
export const bruteForcePermutations = ({ ring, skill, tn, options = {} }) => {
  const { keptDiceCount = ring } = options;
  let allCombs = [];

  const base = tn + 1;
  for (let i = 0; i < Math.pow(tn + 1, ring + skill); i++) {
    let tmp = [];
    let quotient = Math.floor(i / base);
    let remainder = i % base;
    tmp.push(remainder);

    while (quotient > 0) {
      const n = quotient;
      quotient = Math.floor(n / base);
      remainder = n % base;
      tmp.push(remainder);
    }
    for (let j = tmp.length; j < ring + skill; j++) {
      tmp.push(0);
    }
    allCombs.push(tmp.reverse());
  }

  return allCombs.filter(
    (comb) =>
      [...comb]
        .sort()
        .reverse()
        .slice(0, keptDiceCount)
        .reduce((acc, val) => acc + val, 0) === tn
  );
};

const bruteForceExact = ({ ring, skill, tn, options }) => {
  return bruteForcePermutations({ ring, skill, tn, options }).reduce(
    (acc, permutation) => {
      return (
        acc +
        permutation.slice(0, ring).reduce((acc, n) => acc * pRDefault(n), 1) *
          permutation.slice(ring).reduce((acc, n) => acc * pSDefault(n), 1)
      );
    },
    0
  );
};

export const bruteForceChances = ({ ring, skill, tn, options = {} }) => {
  let result = 1;

  for (let i = 0; i < tn; i++) {
    result -= bruteForceExact({ ring, skill, tn: i, options });
  }

  return result;
};

const sameArray = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

const arrayUnique = (array) => {
  const sortedArray = [...array].map((a) => a.sort());

  let result = [];
  let duplicatesIndex = [];

  for (let i = 0; i < sortedArray.length; i++) {
    if (duplicatesIndex.includes(i)) {
      continue;
    }

    for (let j = i + 1; j < array.length; j++) {
      if (sameArray(sortedArray[i], sortedArray[j])) {
        duplicatesIndex.push(j);
      }
    }

    result.push(sortedArray[i]);
  }

  return result;
};

const matchCombOtherDiceAtZero = ({ comb, diceP, diceCount }) => {
  if (comb.length > diceCount) {
    return 0;
  }

  let result = 1;
  comb.forEach((x) => {
    result *= diceP(x);
  });
  result *= Math.pow(diceP(0), diceCount - comb.length);
  result *= permutationsCount([
    ...comb,
    ...new Array(diceCount - comb.length).fill(0),
  ]);

  return result;
};

const combToP = (comb, diceP) => {
  return comb.reduce((acc, x) => acc * diceP(x), 1);
};

const addUpToTN = (comb, tn, options = {}) => {
  const { max = null } = options;

  if (max === null) {
    return comb.reduce((acc, x) => acc + x, 0) >= tn;
  }

  return (
    [...comb]
      .sort()
      .reverse()
      .slice(0, max)
      .reduce((acc, x) => acc + x, 0) >= tn
  );
};

/**
 * Chances to _exactly_ match the TN out of a given roll assuming a "always pick highest" strategy
 *
 * General algorithm:
 * 1. List all combinations summing up to that TN
 * 2. Determine the probability of each happening
 * 3. Sum them all
 *
 * FIXME: With a high TN, a high number of dice rolled, and a low number of dice kept, performances are mediocre
 */
const exactSuccess = ({ ring, skill, tn, options }) => {
  const { compromised = false, keptDiceCount = ring } = options;
  const pR = compromised ? pRCompromised : pRDefault;
  const pS = compromised ? pSCompromised : pSDefault;

  if (tn === 0) {
    return Math.pow(pR(0), ring) * Math.pow(pS(0), skill);
  }

  const combs = ringSkillCombinations({ ring, skill, n: tn, keptDiceCount });
  // Case: Any combination summing up to the TN with less dice than the max that can be kept
  // All other dice must therefore be at zero or the total would be above TN
  const withLessDiceThanMax = combs
    .filter(
      ({ rings: rDice, skills: sDice }) =>
        rDice.length + sDice.length < keptDiceCount
    )
    .reduce((acc, { rings: rDice, skills: sDice }) => {
      return (
        acc +
        matchCombOtherDiceAtZero({
          comb: rDice,
          diceP: pR,
          diceCount: ring,
        }) *
          matchCombOtherDiceAtZero({
            comb: sDice,
            diceP: pS,
            diceCount: skill,
          })
      );
    }, 0);

  const fullCombs = combs.filter(
    ({ rings: rDice, skills: sDice }) =>
      rDice.length + sDice.length === keptDiceCount
  );

  // Case: keptDiceCount ring dice add up exactly to TN
  // Skill dice can have any value as long as it's equal or lower to the lowest ring die
  const withOnlyRingDice = fullCombs
    .filter(({ skills: sDice }) => sDice.length === 0) // <=> rDice.length === keptDiceCount
    .reduce((acc, { rings: rDice }) => {
      let subresult = 1;
      subresult *= combToP(rDice, pR);
      subresult *= permutationsCount(rDice);

      subresult *= complementaryCombinations({
        threshold: Math.min(...rDice),
        size: skill,
      }).reduce((acc, cb) => {
        return acc + combToP(cb, pS) * permutationsCount(cb);
      }, 0);

      return acc + subresult;
    }, 0);

  // Case:
  // 1. keptDiceCount skill dice exactly add up to TN
  // 2. It's not possible to achieve the TN with solely ring dice (to avoid falling back into the previous case)
  const withOnlySkillDice = fullCombs
    .filter(({ rings: rDice }) => rDice.length === 0) // <=> sDice.length === keptDiceCount
    .reduce((acc, { skills: sDice }) => {
      let subresult = 1;
      subresult *= complementaryCombinations({
        threshold: Math.min(...sDice),
        size: ring,
      })
        .filter((cb) => !addUpToTN(cb, tn))
        .reduce((acc, cb) => {
          return acc + combToP(cb, pR) * permutationsCount(cb);
        }, 0);

      subresult *= combToP(sDice, pS);
      subresult *= complementaryCombinations({
        threshold: Math.min(...sDice),
        size: skill - sDice.length,
      }).reduce((acc, cb) => {
        return acc + combToP(cb, pS) * permutationsCount([...sDice, ...cb]);
      }, 0);

      return acc + subresult;
    }, 0);

  // Case: Achieving the TN _requires_ mixing both dice
  const gruellingCases = fullCombs.filter(
    ({ rings: rDice, skills: sDice }) => rDice.length > 0 && sDice.length > 0
  );
  // No more tricks there, we just compute the "supposedly small" list of all these combinations
  let gruellingCombinations = [];
  const addToGruellingCombinations = (comb) => {
    if (
      gruellingCombinations.some(
        ({ rings, skills }) =>
          sameArray([...rings].sort(), [...comb["rings"]].sort()) &&
          sameArray([...skills].sort(), [...comb["skills"]].sort())
      )
    ) {
      return;
    }
    gruellingCombinations.push(comb);
  };
  gruellingCases.forEach(({ rings: rDice, skills: sDice }) => {
    const threshold = Math.min(...rDice, ...sDice);

    const fullRingCombs = complementaryCombinations({
      threshold,
      size: ring - rDice.length,
    }).map((cb) => [...rDice, ...cb]);

    fullRingCombs
      .filter((fullRingComb) => {
        return !addUpToTN(fullRingComb, tn);
      })
      .forEach((fullRingComb) => {
        if (skill === sDice.length) {
          return addToGruellingCombinations({
            rings: fullRingComb,
            skills: sDice,
          });
        }

        complementaryCombinations({
          threshold,
          size: skill - sDice.length,
        })
          .map((cb) => [...sDice, ...cb])
          .filter((fullSkillComb) => {
            return !addUpToTN(fullSkillComb, tn, { max: keptDiceCount });
          })
          .forEach((fullSkillComb) => {
            addToGruellingCombinations({
              rings: fullRingComb,
              skills: fullSkillComb,
            });
          });
      });
  });

  const withBothRingAndSkillDice = gruellingCombinations.reduce(
    (acc, { rings: fullRingComb, skills: fullSkillComb }) => {
      return (
        acc +
        combToP(fullRingComb, pR) *
          permutationsCount(fullRingComb) *
          combToP(fullSkillComb, pS) *
          permutationsCount(fullSkillComb)
      );
    },
    0
  );

  return (
    withLessDiceThanMax +
    withOnlyRingDice +
    withOnlySkillDice +
    withBothRingAndSkillDice
  );
};

/**
 * Chances to _at least_ match the tn out of a given roll
 */
export const cumulativeSuccess = ({ ring, skill, tn, options = {} }) => {
  const { keptDiceCount = ring } = options;

  if (keptDiceCount <= 0) {
    return tn <= 0 ? 1 : 0;
  }
  if (keptDiceCount > ring + skill) {
    throw new Error("Cannot keep more dice than available");
  }
  if (keptDiceCount < ring) {
    throw new Error("Not implemented");
  }

  let result = 1;
  for (let i = 0; i < tn; i++) {
    result -= exactSuccess({ ring, skill, tn: i, options });
  }
  return result;
};

/**
 * Changes to get _exactly_ {n} success and exactly {opp} on a given ring die
 */
const pRExactDefault = ({ n, opp }) => {
  if (opp > 1) {
    return 0;
  }

  if (n === 0) {
    return opp === 1 ? 1 / 3 : 1 / 6;
  }

  if (opp === 0) {
    return Math.pow(1 / 6, n - 1) * (1 / 3 + (1 / 6) * (1 / 6));
  }

  return Math.pow(1 / 6, n) * (1 / 3);
};

/**
 * Chance to end on an opportunity (regardless of the number of success) on a given ring die
 * I.e. the result of the infinite geometric series 1/3+(1/6)*1/3+(1/6)^2*1/3...
 */
const pROppDefault = () => {
  return 2 / 5;
};

/**
 * Changes to get _at least_ {n} success and exactly {opp} on a given ring die
 */
const pRAtLeastDefault = ({ n, opp }) => {
  if (opp > 1) {
    return 0;
  }

  if (opp === 1) {
    return Math.pow(1 / 6, n) * pROppDefault();
  }

  // opp === 0

  if (n === 0) {
    return 1 - pROppDefault();
  }

  return Math.pow(1 / 6, n - 1) * (1 / 3 + (1 / 6) * (1 - pROppDefault()));
};

const pRExactCompromised = ({ n, opp }) => {
  if (opp === 0 && n === 0) {
    return 2 / 3;
  }

  if (opp === 1 && n === 0) {
    return 1 / 6;
  }

  if (opp === 0 && n === 1) {
    return 1 / 6;
  }

  return 0;
};

const pRAtLeastCompromised = ({ n, opp }) => {
  if (opp === 0 && n === 0) {
    return 5 / 6;
  }

  if (opp === 1 && n === 0) {
    return 1 / 6;
  }

  if (opp === 0 && n === 1) {
    return 1 / 6;
  }

  return 0;
};

/**
 * Changes to get _exactly_ {n} success and exactly {opp} on a given skill die
 */
const pSExactDefault = ({ n, opp }) => {
  if (opp > 1) {
    return 0;
  }

  if (n === 0) {
    return opp === 1 ? 1 / 4 : 1 / 6;
  }

  if (opp === 0) {
    return Math.pow(1 / 6, n - 1) * (1 / 3 + (1 / 6) * (1 / 6));
  }

  return Math.pow(1 / 6, n - 1) * (1 / 12 + (1 / 6) * (1 / 4));
};

/**
 * Chance to end on an opportunity (regardless of the number of success) on a given skill die
 * I.e. the result of the infinite geometric series 1/3+(1/6)*1/3+(1/6)^2*1/3...
 */
const pSOppDefault = () => {
  return 2 / 5;
};

/**
 * Changes to get _at least_ {n} success and exactly {opp} on a given skill die
 */
const pSAtLeastDefault = ({ n, opp }) => {
  if (opp > 1) {
    return 0;
  }

  if (opp === 1) {
    return Math.pow(1 / 6, n - 1) * (1 / 12 + (1 / 6) * pSOppDefault());
  }

  // opp === 0

  if (n === 0) {
    return 1 - pROppDefault();
  }

  return Math.pow(1 / 6, n - 1) * (1 / 3 + (1 / 6) * (1 - pSOppDefault()));
};

const pSExactCompromised = ({ n, opp }) => {
  if (opp > 1) {
    return 0;
  }

  if (n === 0) {
    return opp === 1 ? 1 / 4 : 1 / 6;
  }

  if (opp === 0) {
    return Math.pow(1 / 12, n - 1) * (1 / 6 + (1 / 12) * (5 / 12));
  }

  return Math.pow(1 / 12, n - 1) * (1 / 12 + (1 / 12) * (1 / 4));
};

/**
 * (1/3)+(1/12)*(1/3)+(1/12)^2*(1/3)...
 */
const pSOppCompromised = () => {
  return 4 / 11;
};

const pSAtLeastCompromised = ({ n, opp }) => {
  if (opp > 1) {
    return 0;
  }

  if (opp === 1) {
    return Math.pow(1 / 12, n - 1) * (1 / 12 + (1 / 12) * pSOppCompromised());
  }

  // opp === 0

  if (n === 0) {
    return 1 - pSOppCompromised();
  }

  return (
    Math.pow(1 / 12, n - 1) * (1 / 6 + (1 / 12) * (1 - pSOppCompromised()))
  );
};

const zeroOnePermutations = ({ totalDiceCount, min, max }) => {
  let storage = [];

  const findPermutations = (candidate) => {
    if (candidate.length > totalDiceCount) {
      return;
    }
    if (candidate.some((value) => value > 1)) {
      return;
    }
    if (candidate.length === totalDiceCount) {
      const total = candidate.reduce((acc, val) => acc + val, 0);
      if (total >= min && (!max || total <= max)) {
        storage.push(candidate);
      }
    }

    const newCandidateA = [...candidate, 0];
    const newCandidateB = [...candidate];
    newCandidateB[newCandidateB.length - 1] =
      newCandidateB[newCandidateB.length - 1] + 1;
    findPermutations(newCandidateA);
    findPermutations(newCandidateB);
  };

  findPermutations([0]);
  return storage;
};

const sameSuccessOppComb = (combA, combB) => {
  if (combA.length !== combB.length) {
    return false;
  }

  return combA.every(({ success, opportunity }, i) => {
    return (
      combB[i]["success"] === success && combB[i]["opportunity"] === opportunity
    );
  });
};

const sorter = (
  { success: a1, opportunity: b1 },
  { success: a2, opportunity: b2 }
) => {
  return a2 - a1 || b2 - b1;
};

const coeff = (cb) =>
  permutationsCount(
    cb.map(({ success, opportunity }) => {
      return `${success}-${opportunity}`;
    })
  );

// FIXME More or less a brute force algorithm with abysmal complexity
const successOppCombinations = ({ ring, skill, tn, keptDiceCount, opp }) => {
  const masks = zeroOnePermutations({
    totalDiceCount: ring + skill,
    min: keptDiceCount,
    max: keptDiceCount,
  });

  const baseCombs = (size) => {
    if (size === 0) {
      return [[]];
    }

    let combs = [];

    const oppPerms = zeroOnePermutations({
      totalDiceCount: size,
      min: 0,
    });

    complementaryCombinations({
      threshold: tn,
      size,
    }).forEach((cb) => {
      oppPerms.forEach((perm) => {
        let crossedCb = new Array(size);
        for (let i = 0; i < size; i++) {
          crossedCb[i] = { success: cb[i], opportunity: perm[i] };
        }
        crossedCb.sort(sorter);
        if (
          combs.some((existingCb) => {
            return sameSuccessOppComb(existingCb, crossedCb);
          })
        ) {
          return;
        }
        combs.push(crossedCb);
      });
    });

    return combs;
  };

  const ringCombs = baseCombs(ring);
  const skillCombs = baseCombs(skill);

  let combs = [];

  ringCombs.forEach((ringComb) => {
    skillCombs.forEach((skillComb) => {
      const fullComb = [...ringComb, ...skillComb];

      for (let i = 0; i < masks.length; i++) {
        const mask = masks[i];

        const totalSuccess = fullComb.reduce(
          (acc, { success }, index) => acc + success * mask[index],
          0
        );
        if (totalSuccess < tn) {
          continue;
        }
        const totalOpp = fullComb.reduce(
          (acc, { opportunity }, index) => acc + opportunity * mask[index],
          0
        );
        if (totalOpp < opp) {
          continue;
        }
        combs.push({ ringDice: ringComb, skillDice: skillComb });
        break;
      }
    });
  });

  return combs;
};

export const chances = ({ ring, skill, tn, opp = 0, options = {} }) => {
  if (opp === 0) {
    return cumulativeSuccess({ ring, skill, tn, options });
  }

  const { compromised = false, keptDiceCount = ring } = options;

  if (opp > keptDiceCount) {
    return 0;
  }

  const pRAtLeast = compromised ? pRAtLeastCompromised : pRAtLeastDefault;
  const pRExact = compromised ? pRExactCompromised : pRExactDefault;
  const pSAtLeast = compromised ? pSAtLeastCompromised : pSAtLeastDefault;
  const pSExact = compromised ? pSExactCompromised : pSExactDefault;

  return successOppCombinations({
    ring,
    skill,
    tn,
    keptDiceCount,
    opp,
  }).reduce((acc, { ringDice, skillDice }) => {
    return (
      acc +
      coeff(ringDice) *
        ringDice.reduce((acc, { success, opportunity }) => {
          const current = () => {
            if (success === tn) {
              return pRAtLeast({ n: success, opp: opportunity });
            }

            return pRExact({ n: success, opp: opportunity });
          };
          return acc * current();
        }, 1) *
        coeff(skillDice) *
        skillDice.reduce((acc, { success, opportunity }) => {
          const current = () => {
            if (success === tn) {
              return pSAtLeast({ n: success, opp: opportunity });
            }

            return pSExact({ n: success, opp: opportunity });
          };
          return acc * current();
        }, 1)
    );
  }, 0);
};
