const REROLL_TYPES = [
  "adversity",
  "distinction",
  "shadow",
  "deathdealer",
  "manipulator",
  "ishiken",
  "2heavens",
  "ruthless",
  "sailor",
  "wandering",
];

export const isReroll = (modifier) => {
  if (isSpecialReroll(modifier) || isSpecialAlteration(modifier)) {
    return true;
  }

  return REROLL_TYPES.includes(modifier);
};

export const isSpecialReroll = (modifier) => {
  return /^ruleless([0-9]{2})?$/.test(modifier);
};

export const isSpecialAlteration = (modifier) => {
  return /^reasonless([0-9]{2})?$/.test(modifier);
};

export const rolledDicesCount = ({ ring, skill, modifiers }) => {
  return (
    ring +
    skill +
    assistDiceCount(modifiers) +
    (modifiers.includes("void") ? 1 : 0) +
    (modifiers.includes("wandering") ? 1 : 0)
  );
};

export const keptDicesCount = ({ ring, modifiers }) => {
  return (
    ring + (modifiers.includes("void") ? 1 : 0) + assistDiceCount(modifiers)
  );
};

export const isAlteration = (modifier) => {
  return (
    ["ishiken", "wandering"].includes(modifier) || isSpecialAlteration(modifier)
  );
};

const assistDiceCount = (modifiers) => {
  if (!modifiers?.length) {
    return 0;
  }

  return modifiers
    .filter((modifier) => /^(un)?skilledassist([0-9]{2})$/.test(modifier))
    .map((modifier) => parseInt(modifier.slice(-2)))
    .reduce((acc, val) => acc + val, 0);
};

export const countDices = (keptDices) => {
  return {
    successCount: keptDices.reduce(
      (acc, dice) =>
        acc + (dice.value.explosion || 0) + (dice.value.success || 0),
      0
    ),
    opportunityCount: keptDices.reduce(
      (acc, dice) => acc + (dice.value.opportunity || 0),
      0
    ),
    strifeCount: keptDices.reduce(
      (acc, dice) => acc + (dice.value.strife || 0),
      0
    ),
    blankCount: keptDices.filter(
      ({ value: { strife, opportunity, success, explosion } }) =>
        strife === 0 && opportunity === 0 && success === 0 && explosion === 0
    ).length,
  };
};

export const orderDices = (dices) => {
  const reorder = [...dices];

  reorder.sort((a, b) => {
    if (a.type === "ring" && b.type === "skill") {
      return -1;
    }
    if (b.type === "ring" && a.type === "skill") {
      return 1;
    }
    return 0;
  });

  return reorder;
};

export const isRerollOfType = ({ status, metadata }, rerollType) => {
  if (status !== "rerolled") {
    return false;
  }

  // Legacy
  if (!metadata.end) {
    return metadata.modifier === rerollType;
  }

  return metadata.end === rerollType;
};

export const isFromRerollOfType = ({ status, metadata }, rerollType) => {
  // Legacy
  if (!metadata.source && !metadata.end && metadata.modifier) {
    return status !== "rerolled" && metadata.modifier === rerollType;
  }

  return metadata.source === rerollType;
};

export const replaceRerollsOfType = ({
  dices,
  rerollType,
  previousRerollTypes = [],
  basePool,
}) => {
  const isRerollOfRightType = (dice) => isRerollOfType(dice, rerollType);

  const previousDices = () => {
    if (previousRerollTypes.length === 0) {
      return dices.slice(0, basePool);
    }

    const previousTypesMinusOne = [...previousRerollTypes];
    const previousType = previousTypesMinusOne.pop();

    return replaceRerollsOfType({
      dices,
      rerollType: previousType,
      previousRerollTypes: previousTypesMinusOne,
      basePool,
    });
  };

  const rerollResults = dices.filter((dice) =>
    isFromRerollOfType(dice, rerollType)
  );
  const ringResults = rerollResults.filter(({ type }) => type === "ring");
  const skillResults = rerollResults.filter(({ type }) => type === "skill");

  return previousDices().map((dice) => {
    if (isRerollOfRightType(dice)) {
      return (dice.type === "skill" ? skillResults : ringResults).shift();
    }
    return dice;
  });
};

export const replaceRerolls = ({ dices, rerollTypes, basePool }) => {
  const rerollCount = dices.filter(
    ({ status }) => status === "rerolled"
  ).length;
  if (rerollCount === 0) {
    return dices;
  }

  const previousRerollTypes = [...rerollTypes];
  const rerollType = previousRerollTypes.pop();

  return [
    ...replaceRerollsOfType({
      dices,
      rerollType,
      previousRerollTypes,
      basePool,
    }),
    ...dices.slice(basePool + rerollCount), // Explosions
  ];
};

export const splitExplosions = ({ dices, basePool, rerollTypes }) => {
  let split = [];
  let remainingDices = replaceRerolls({ dices, basePool, rerollTypes });
  let size =
    basePool +
    dices.filter(({ metadata }) => metadata?.source === "addkept").length;
  while (remainingDices.length > 0) {
    const currentDices = orderDices(remainingDices.slice(0, size));
    remainingDices = remainingDices.slice(size, remainingDices.length);
    size = currentDices.filter(
      ({ status, value: { explosion } }) => status === "kept" && explosion > 0
    ).length;
    split.push(currentDices);
  }
  return split;
};
