export const parse = (str) => {
  if (!str) {
    return false;
  }

  const s = str.replace(/\s+/g, "").toLowerCase();

  const matches = s.match(/^([0-9]{1,2})d([0-9]{1,3})((\+|-)[0-9]+)?$/);

  if (!matches) {
    return false;
  }
  const number = parseInt(matches[1]);
  const sides = parseInt(matches[2]);
  const modifier = !!matches[3] ? parseInt(matches[3]) : 0;

  if (!number || !sides) {
    return false;
  }

  return { dices: [{ number, sides }], modifier };
};

export const stringify = (parameters) => {
  const { dices, modifier } = parameters;
  const diceString = dices
    .map(({ number, sides }) => `${number}d${sides}`)
    .join("+");
  const modifierString = !!modifier
    ? modifier > 0
      ? `+${modifier}`
      : modifier.toString()
    : "";

  return `${diceString}${modifierString}`;
};
