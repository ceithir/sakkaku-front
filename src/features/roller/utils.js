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
      reorder.push(rerollDices[i]);
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
