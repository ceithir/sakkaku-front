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
 * Chances to _exactly_ match the TN out of a given roll
 */
const exactSuccess = ({ ring, skill, tn }) => {
  if (skill > 0) {
    throw "TODO";
  }

  const n = tn;
  const maxCardinality = ring;

  if (n === 0) {
    return Math.pow(pR(0), ring);
  }

  if (n === 1) {
    return binomial(ring, 1) * pR(n) * Math.pow(pR(0), ring - 1);
  }

  if (n === 2) {
    let result = binomial(ring, 1) * pR(n) * Math.pow(pR(0), ring - 1);

    if (maxCardinality >= 2) {
      result +=
        binomial(ring, 2) * Math.pow(pR(1), 2) * Math.pow(pR(0), ring - 2);
    }

    return result;
  }

  if (n === 3) {
    let result = binomial(ring, 1) * pR(n) * Math.pow(pR(0), ring - 1);

    if (maxCardinality >= 2) {
      result +=
        2 * binomial(ring, 2) * pR(2) * pR(1) * Math.pow(pR(0), ring - 2);
    }

    if (maxCardinality >= 3) {
      result +=
        binomial(ring, 3) * Math.pow(pR(1), 3) * Math.pow(pR(0), ring - 3);
    }

    return result;
  }

  if (n === 4) {
    let result = binomial(ring, 1) * pR(n) * Math.pow(pR(0), ring - 1);

    if (maxCardinality >= 2) {
      result +=
        2 * binomial(ring, 2) * pR(3) * pR(1) * Math.pow(pR(0), ring - 2);
      result += binomial(ring, 2) * pR(2) * pR(2) * Math.pow(pR(0), ring - 2);
    }
    if (maxCardinality >= 3) {
      result +=
        3 *
        binomial(ring, 3) *
        pR(2) *
        pR(1) *
        pR(1) *
        Math.pow(pR(0), ring - 3);
    }
    if (maxCardinality >= 4) {
      result +=
        binomial(ring, 4) * Math.pow(pR(1), 4) * Math.pow(pR(0), ring - 4);
    }

    return result;
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
