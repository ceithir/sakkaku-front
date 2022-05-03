export const parse = (str) => {
  if (!str) {
    return false;
  }

  const s = str.replace(/\s+/g, "").toLowerCase();

  const matches = s.match(
    /^([0-9]{1,2})d([0-9]{1,3})(\+([0-9]{1,2})d([0-9]{1,3})|(\+|-)[0-9]+)*$/
  );

  if (!matches) {
    return false;
  }

  const dices = s
    .match(/\+?[0-9]+d[0-9]+/g)
    .map((str) => {
      const m = str.match(/([0-9]+)d([0-9]+)/);
      return {
        number: parseInt(m[1]),
        sides: parseInt(m[2]),
      };
    })
    .filter(({ number, sides }) => number > 0 && sides > 0);

  if (!dices.length) {
    return false;
  }

  let modifier = 0;
  const modifiers = s.match(/(\+|-)[0-9]+(?!d)/g);
  if (!!modifiers) {
    modifiers.forEach((mod) => {
      modifier += parseInt(mod);
    });
  }

  return { dices, modifier };
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
