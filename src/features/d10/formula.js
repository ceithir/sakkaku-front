export const parse = (str) => {
  if (!str) {
    return false;
  }

  const s = str.replace(/\s+/g, "");
  const matches = s.match(/^([0-9]+)k([0-9]+)((\+|-)([0-9]+k[0-9]+|[0-9]+))*$/);

  if (!matches) {
    return false;
  }
  let roll = parseInt(matches[1]);
  let keep = parseInt(matches[2]);
  let modifier = 0;

  const plusXKeepYGroups = s.match(/\+[0-9]+k[0-9]+/g);
  if (!!plusXKeepYGroups) {
    plusXKeepYGroups.forEach((plusXKeepY) => {
      const [, extraRoll, extraKeep] = plusXKeepY.match(
        /^\+([0-9]+)k([0-9]+)$/
      );
      roll += parseInt(extraRoll);
      keep += parseInt(extraKeep);
    });
  }
  const minusXKeepYGroups = s.match(/-[0-9]+k[0-9]+/g);
  if (!!minusXKeepYGroups) {
    minusXKeepYGroups.forEach((minusXKeepY) => {
      const [, extraRoll, extraKeep] =
        minusXKeepY.match(/^-([0-9]+)k([0-9]+)$/);
      roll -= parseInt(extraRoll);
      keep -= parseInt(extraKeep);
    });
  }

  const modifiers = s.match(/(\+|-)[0-9]+(?!k)/g);
  if (!!modifiers) {
    modifiers.forEach((mod) => {
      modifier += parseInt(mod);
    });
  }

  return { roll, keep, modifier };
};
