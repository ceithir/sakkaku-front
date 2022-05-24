export const parse = (str) => {
  if (!str) {
    return false;
  }

  const s = str.replace(/\s+/g, "").toLowerCase();

  const dieRegexp = /([0-9]{1,2})d([0-9]{1,3})((k|kh|kl)([0-9]{1,2}))?/;

  const matches = s.match(
    new RegExp(
      "^" + dieRegexp.source + "(\\+" + dieRegexp.source + "|(\\+|-)[0-9]+)*$"
    )
  );

  if (!matches) {
    return false;
  }

  const dices = s
    .match(new RegExp("\\+?" + dieRegexp.source, "g"))
    .map((str) => {
      const m = str.match(dieRegexp);

      const number = parseInt(m[1]);
      const sides = parseInt(m[2]);

      if (!!m[3]) {
        return {
          number,
          sides,
          keepNumber: parseInt(m[5]),
          keepCriteria: m[4] === "kl" ? "lowest" : "highest",
        };
      }

      return {
        number,
        sides,
      };
    })
    .filter(({ number, sides }) => number > 0 && sides > 0);

  if (!dices.length) {
    return false;
  }

  for (let i = 0; i < dices.length; i++) {
    if (dices[i]["keepNumber"] !== undefined) {
      if (
        dices[i]["keepNumber"] <= 0 ||
        dices[i]["keepNumber"] > dices[i]["number"]
      ) {
        return false;
      }
    }
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
  if (!parameters) {
    return false;
  }

  const { dices, modifier } = parameters;
  const diceString = dices
    .map(({ number, sides, keepNumber, keepCriteria }) => {
      if (!!keepNumber) {
        return `${number}d${sides}${
          keepCriteria === "lowest" ? "kl" : "kh"
        }${keepNumber}`;
      }

      return `${number}d${sides}`;
    })
    .join("+");
  const modifierString = !!modifier
    ? modifier > 0
      ? `+${modifier}`
      : modifier.toString()
    : "";

  return `${diceString}${modifierString}`;
};
