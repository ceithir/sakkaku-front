/**
 * Known issues:
 * - Probabilities were checked for consistency in the generic case against the empirical results from https://l5r-dice-sim.vercel.app/ so any bias from this one is also reflected there
 * - Nothing has been done to avoid rounding errors piling up
 * - The maths are done as if the dice exploded before being chosen to be kept
 */

export const distinctPermutationsCount = (list) => {
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

export const pRCompromised = (n) => {
  if (n === 0) {
    return 5 / 6;
  }
  if (n === 1) {
    return 1 / 6;
  }
  return 0;
};

export const pSCompromised = (n) => {
  if (n === 0) {
    return 2 / 3;
  }
  return Math.pow(1 / 12, n - 1) * (1 / 4 + (1 / 12) * (2 / 3));
};

/**
 * Determine the different sums that can end up with a result of n
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
export const combinations = (n, options = {}) => {
  const { maxCardinality = null, maxValue = null } = options;

  let storage = [];

  const findCombinations = (candidate) => {
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
      findCombinations(newCandidateA);
      findCombinations(newCandidateB);
    }
    if (total === n) {
      storage.push(candidate);
    }
  };

  findCombinations([1]);
  return storage;
};

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
 * Determine the number of _non-distinct_ combinations of skill and ring dice
 * That can sum up to n
 *
 * Ring=2, Skill=3, N=5 -> [
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

 * ]
 */
export const skilledCombinations = ({ ring, skill, n }) => {
  const combs = combinations(n, { maxCardinality: ring });

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

export const uniqueSkilledCombinations = ({ ring, skill, n }) => {
  const array = skilledCombinations({ ring, skill, n }).map(
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

export const distinctComplementaryCombinations = ({ threshold, size }) => {
  if (size === 0) {
    return [];
  }

  if (threshold === 0) {
    return [new Array(size).fill(0)];
  }

  let result = [new Array(size).fill(0)];
  for (let i = 1; i <= size * threshold; i++) {
    arrayUnique(
      combinations(i, { maxCardinality: size, maxValue: threshold })
    ).forEach((comb) => {
      result.push([...new Array(size - comb.length).fill(0), ...comb]);
    });
  }
  return result;
};

/**
 * Supposedly for testing/debugging only...
 */
export const bruteForcePermutations = ({ ring, skill, tn }) => {
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
        .slice(0, ring)
        .reduce((acc, val) => acc + val, 0) === tn
  );
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

/**
 * Chances to _exactly_ match the TN out of a given roll assuming a "always pick highest" strategy
 */
const exactSuccess = ({ ring, skill, tn, options }) => {
  const { compromised = false } = options;
  const pR = compromised ? pRCompromised : pRDefault;
  const pS = compromised ? pSCompromised : pSDefault;

  if (tn === 0) {
    return Math.pow(pR(0), ring) * Math.pow(pS(0), skill);
  }

  const matchCombOtherDiceAtZero = ({ comb, diceP, diceCount }) => {
    if (comb.length > diceCount) {
      return 0;
    }

    let result = 1;
    comb.forEach((x) => {
      result *= diceP(x);
    });
    result *= Math.pow(diceP(0), diceCount - comb.length);
    result *= distinctPermutationsCount([
      ...comb,
      ...new Array(diceCount - comb.length).fill(0),
    ]);

    return result;
  };

  const combToP = (comb, diceP) => {
    return comb.reduce((acc, x) => acc * diceP(x), 1);
  };

  const combs = uniqueSkilledCombinations({ ring, skill, n: tn });

  const partialCombs = combs.filter(
    ({ rings: rDice, skills: sDice }) => rDice.length + sDice.length < ring
  );

  // Case: Any combination that achieves the TN with less dice than can be kept
  // All other dice must then be zero or the total would be above TN
  const withLessDiceThanMax = partialCombs.reduce(
    (acc, { rings: rDice, skills: sDice }) => {
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
    },
    0
  );

  const fullCombs = combs.filter(
    ({ rings: rDice, skills: sDice }) => rDice.length + sDice.length === ring
  );

  // Case: All ring dice exactly add up to TN
  // Skill dice can be anything as long as it's equal or lower to the lowest ring die
  const withOnlyRingDice = fullCombs
    .filter(({ skills: sDice }) => sDice.length === 0) // <=> rDice.length === ring
    .reduce((acc, { rings: rDice }) => {
      let subresult = 1;
      subresult *= combToP(rDice, pR);
      subresult *= distinctPermutationsCount(rDice);

      if (skill > 0) {
        subresult *= distinctComplementaryCombinations({
          threshold: Math.min(...rDice),
          size: skill,
        }).reduce((acc, cb) => {
          return acc + combToP(cb, pS) * distinctPermutationsCount(cb);
        }, 0);
      }

      return acc + subresult;
    }, 0);

  const addUpToTN = (comb, options = {}) => {
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

  // Case: A total of ring skill dice exactly add up to TN
  // And the ring dice do not add up to TN (to avoid falling back into the previous case)
  const withOnlySkillDice = fullCombs
    .filter(({ rings: rDice }) => rDice.length === 0) // <=> sDice.length === ring
    .reduce((acc, { skills: sDice }) => {
      let subresult = 1;
      subresult *= distinctComplementaryCombinations({
        threshold: Math.min(...sDice),
        size: ring,
      })
        .filter((cb) => !addUpToTN(cb))
        .reduce((acc, cb) => {
          return acc + combToP(cb, pR) * distinctPermutationsCount(cb);
        }, 0);

      subresult *= combToP(sDice, pS);
      if (sDice.length === skill) {
        subresult *= distinctPermutationsCount(sDice);
      } else {
        subresult *= distinctComplementaryCombinations({
          threshold: Math.min(...sDice),
          size: skill - sDice.length,
        }).reduce((acc, cb) => {
          return (
            acc + combToP(cb, pS) * distinctPermutationsCount([...sDice, ...cb])
          );
        }, 0);
      }

      return acc + subresult;
    }, 0);

  // Case: Achieving TN _requires_ mixing both dice
  const gruellingCases = fullCombs.filter(
    ({ rings: rDice, skills: sDice }) => rDice.length > 0 && sDice.length > 0
  );
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

    distinctComplementaryCombinations({
      threshold,
      size: ring - rDice.length,
    })
      .map((cb) => [...rDice, ...cb])
      .filter((fullRingComb) => {
        return !addUpToTN(fullRingComb);
      })
      .forEach((fullRingComb) => {
        if (skill === sDice.length) {
          return addToGruellingCombinations({
            rings: fullRingComb,
            skills: sDice,
          });
        }

        distinctComplementaryCombinations({
          threshold,
          size: skill - sDice.length,
        })
          .map((cb) => [...sDice, ...cb])
          .filter((fullSkillComb) => {
            return !addUpToTN(fullSkillComb, { max: ring });
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
          distinctPermutationsCount(fullRingComb) *
          combToP(fullSkillComb, pS) *
          distinctPermutationsCount(fullSkillComb)
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
  if (ring <= 0) {
    return tn <= 0 ? 1 : 0;
  }

  let result = 1;
  for (let i = 0; i < tn; i++) {
    result -= exactSuccess({ ring, skill, tn: i, options });
  }
  return result;
};