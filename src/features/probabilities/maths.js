// Caveat: Nothing has been done to avoid rounding errors piling up

export const binomial = (n, k) => {
  return factorial(n) / (factorial(n - k) * factorial(k));
};

const factorial = (n) => {
  if (n < 0) {
    throw "n must be >= 0";
  }
  if (n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
};

export const funcSum = ({ func, n, i = 0 }) => {
  let result = 0;
  for (let j = i; j <= n; j++) {
    result += func(j);
  }
  return result;
};

/**
 * Chances to get _exactly_ n success out of a given ring die
 */
export const pR = (n) => {
  if (n === 0) {
    return 1 / 2;
  }

  return Math.pow(1 / 6, n - 1) * (1 / 3 + (1 / 6) * (1 / 2));
};

/**
 * Chances to get _exactly_ n success out of a given skill die
 */
export const pS = (n) => {
  if (n === 0) {
    return 5 / 12;
  }

  return Math.pow(1 / 6, n - 1) * (5 / 12 + (1 / 6) * (5 / 12));
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
  const { maxCardinality = null } = options;

  // TODO: Check if a smoother algorithm exists
  const findCombinations = ({ n, candidate, storage, maxCardinality }) => {
    if (maxCardinality !== null && candidate.length > maxCardinality) {
      return;
    }

    const total = candidate.reduce((acc, val) => acc + val, 0);
    if (total < n) {
      const newCandidateA = [...candidate, 1];
      const newCandidateB = [...candidate];
      newCandidateB[newCandidateB.length - 1] =
        newCandidateB[newCandidateB.length - 1] + 1;
      findCombinations({
        n,
        candidate: newCandidateA,
        storage,
        maxCardinality,
      });
      findCombinations({
        n,
        candidate: newCandidateB,
        storage,
        maxCardinality,
      });
    }
    if (total === n) {
      storage.push(candidate);
    }
  };

  let storage = [];
  findCombinations({ n, candidate: [1], storage, maxCardinality });
  return storage;
};

/**
 * Same as previous except it groups together combinations identical but for sorting order
 * Example:
 * n=4 -> [
      { value: [1, 1, 1, 1], count: 1 },
      { value: [1, 1, 2], count: 3 },
      { value: [1, 3], count: 2 },
      { value: [2, 2], count: 1 },
      { value: [4], count: 1 },
    ]
 */
export const sortedCombinations = (n, options = {}) => {
  return grouper(combinations(n, options));
};

// FIXME: Removed if unused, document if used
export const subsets = ({ ring, skill, size }) => {
  if (size > ring.length + skill.length) {
    throw "Out of bounds";
  }
  if (ring < 1) {
    throw "Not possible for a standard roll thus not implemented";
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

  return grouper(storage).map(({ value }) => {
    const r = value.filter((x) => x === "r").length;
    const s = value.filter((x) => x === "s").length;

    return {
      ring: r,
      skill: s,
    };
  });
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

const grouper = (array) => {
  let result = [];
  let analyzedIndex = [];

  for (let i = 0; i < array.length; i++) {
    if (analyzedIndex.includes(i)) {
      continue;
    }
    const value = [...array[i]].sort();
    let count = 1;

    for (let j = i + 1; j < array.length; j++) {
      if (sameArray(value, [...array[j]].sort())) {
        count++;
        analyzedIndex.push(j);
      }
    }

    result.push({ value, count });
    analyzedIndex.push(i);
  }

  return result;
};

/**
 * Chances to _exactly_ match the TN out of a given roll assuming a "always pick highest" strategy
 */
const exactSuccess = ({ ring, skill, tn }) => {
  if (tn === 0) {
    return Math.pow(pR(0), ring) * Math.pow(pS(0), skill);
  }

  if (skill === 0) {
    return sortedCombinations(tn, { maxCardinality: ring }).reduce(
      (acc, { value, count }) => {
        const diceCount = value.length;
        return (
          acc +
          count *
            binomial(ring, diceCount) *
            value.reduce((acc, dieValue) => acc * pR(dieValue), 1) *
            Math.pow(pR(0), ring - diceCount)
        );
      },
      0
    );
  }

  /**
   * Probability x dice will have a n value
   * With all other dice's values between 0 and n-1
   */
  const exactlyXRingDiceMatchingN = (x, n) => {
    if (x > ring) {
      return 0;
    }

    return (
      binomial(ring, x) *
      Math.pow(pR(n), x) *
      Math.pow(funcSum({ func: pR, n: n - 1 }), ring - x)
    );
  };

  const exactlyXSkillDiceMatchingN = (x, n) => {
    if (x > skill) {
      return 0;
    }

    return (
      binomial(skill, x) *
      Math.pow(pS(n), x) *
      Math.pow(funcSum({ func: pS, n: n - 1 }), skill - x)
    );
  };

  if (ring === 1) {
    return (
      pR(tn) * Math.pow(funcSum({ func: pS, n: tn }), skill) +
      funcSum({ func: pR, n: tn - 1 }) *
        funcSum({
          func: (x) => exactlyXSkillDiceMatchingN(x, tn),
          n: skill,
          i: 1,
        })
    );
  }

  /**
   * One die at TN, everything else at zero
   */
  const matchTNWithExactlyOneDie =
    ring * pR(tn) * Math.pow(pR(0), ring - 1) * Math.pow(pS(0), skill) +
    skill * pS(tn) * Math.pow(pR(0), ring) * Math.pow(pS(0), skill - 1);

  if (tn === 1) {
    return matchTNWithExactlyOneDie;
  }

  // From this point onwards, ring >=2, skill >=1, tn >=2

  if (tn === 2) {
    if (ring === 2) {
      let result = 0;
      result += matchTNWithExactlyOneDie;

      // Result achieved with rings only
      result +=
        funcSum({
          func: (x) => exactlyXRingDiceMatchingN(x, 1),
          n: ring,
          i: 2,
        }) * Math.pow(funcSum({ func: pS, n: 1 }), skill);

      // Mix ring/skill
      result +=
        exactlyXRingDiceMatchingN(1, 1) *
        funcSum({
          func: (x) => exactlyXSkillDiceMatchingN(x, 1),
          n: skill,
          i: 1,
        });

      // Skill only
      if (skill > 1) {
        result +=
          Math.pow(pR(0), ring) *
          funcSum({
            func: (x) => exactlyXSkillDiceMatchingN(x, 1),
            n: skill,
            i: 2,
          });
      }

      return result;
    }

    return (
      matchTNWithExactlyOneDie +
      exactlyXRingDiceMatchingN(2, 1) * Math.pow(pS(0), skill) +
      exactlyXRingDiceMatchingN(1, 1) * exactlyXSkillDiceMatchingN(1, 1) +
      Math.pow(pR(0), ring) * exactlyXSkillDiceMatchingN(2, 1)
    );
  }

  if (tn === 3) {
    if (ring === 2) {
      if (skill === 1) {
        return (
          matchTNWithExactlyOneDie +
          2 * pR(2) * (pR(1) * pS(0) + pR(0) * pS(1) + pR(1) * pS(1)) +
          2 * pR(1) * pR(0) * pS(2) +
          pR(1) * pR(1) * pS(2)
        );
      }
      if (skill === 2) {
        return (
          matchTNWithExactlyOneDie +
          // Only rings
          2 * pR(2) * pR(1) * (pS(0) + pS(1)) * (pS(0) + pS(1)) +
          // Ring + Skill
          2 * pR(2) * pR(0) * pS(1) * (2 * pS(0) + pS(1)) +
          (2 * pR(1) * pR(0) + pR(1) * pR(1)) *
            pS(2) *
            (2 * pS(0) + 2 * pS(1)) +
          // Only skills
          pR(0) * pR(0) * 2 * pS(2) * pS(1)
        );
      }
    }
  }

  if (tn === 4) {
    if (ring === 2) {
      if (skill === 1) {
        return (
          matchTNWithExactlyOneDie +
          // 3+1
          2 * pR(3) * (pR(0) * pS(1) + pR(1) * (pS(0) + pS(1))) +
          (2 * pR(1) * pR(0) + pR(1) * pR(1)) * pS(3) +
          //2+2
          2 * (pR(0) + pR(1)) * pR(2) * pS(2) +
          pR(2) * pR(2) * (pS(0) + pS(1)) +
          pR(2) * pR(2) * pS(2)
        );
      }
    }
  }

  throw "TODO";
};

/**
 * Chances to _at least_ match the tn out of a given roll
 */
export const cumulativeSuccess = ({ ring, skill, tn }) => {
  if (ring <= 0) {
    return tn <= 0 ? 1 : 0;
  }

  let result = 1;
  for (let i = 0; i < tn; i++) {
    result -= exactSuccess({ ring, skill, tn: i });
  }
  return result;
};
