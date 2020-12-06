// TODO: Move this somehwere more logical
export const REROLL_TYPES = [
  "adversity",
  "distinction",
  "shadow",
  "deathdealer",
];

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
  };
};

export const hideRerolls = (dices) => {
  const isAReroll = ({ status }) => status === "rerolled";
  const isFromReroll = ({ status, metadata }) =>
    metadata?.modifier && status !== "rerolled";

  const rerollDices = orderDices(dices.filter(isFromReroll));

  let i = 0;
  let reorder = [];
  dices.forEach((dice) => {
    if (isFromReroll(dice)) {
      return;
    }

    if (isAReroll(dice)) {
      rerollDices[i] && reorder.push(rerollDices[i]);
      i++;
      return;
    }

    reorder.push(dice);
  });
  return reorder;
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
    const previousType = previousTypesMinusOne.shift();

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
