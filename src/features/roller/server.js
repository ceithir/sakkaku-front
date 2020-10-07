const ringDie = [
  {},
  { opportunity: 1, strife: 1 },
  { opportunity: 1 },
  { success: 1, strife: 1 },
  { success: 1 },
  { explosion: 1, strife: 1 },
];

const skillDie = [
  {},
  {},
  { opportunity: 1 },
  { opportunity: 1 },
  { opportunity: 1 },
  { success: 1, strife: 1 },
  { success: 1, strife: 1 },
  { success: 1 },
  { success: 1 },
  { success: 1, opportunity: 1 },
  { explosion: 1, strife: 1 },
  { explosion: 1 },
];

const rollDice = (dice) => {
  return dice[Math.floor(Math.random() * dice.length)];
};

const rollDices = ({ ring, skill }) => {
  return [
    ...[...Array(ring)].map(() => {
      return { type: "ring", ...rollDice(ringDie) };
    }),
    ...[...Array(skill)].map(() => {
      return { type: "skill", ...rollDice(skillDie) };
    }),
  ];
};

// Will do an actual server call in real life
// Fow now actually handle the whole logic there
// Without all the important validations

export const create = async (roll) => {
  return { ...roll, rolledDices: rollDices(roll) };
};

export const keep = async (roll, toKeep) => {
  const dices = roll.rolledDices;
  const keptDices = dices.filter((_, index) => {
    return toKeep.includes(index);
  });

  return {
    ...roll,
    keepSelection: toKeep,
    keptDices,
    unresolvedExplosions: keptDices
      .filter((dice) => dice.explosion)
      .map((_, index) => index),
  };
};

export const explode = async (roll, index) => {
  const currentExplosion = roll.keptDices[index];
  const explosionsLeft = roll.unresolvedExplosions.filter((i) => i !== index);
  const { type, explosion } = currentExplosion;

  return {
    ...roll,
    unresolvedExplosions: explosionsLeft,
    temporaryDices: [
      ...(roll.temporaryDices || []),
      ...[...Array(explosion)].map(() => {
        return { type, ...rollDice(type === "skill" ? skillDie : ringDie) };
      }),
    ],
  };
};

export const keepTemporary = async (roll, index) => {
  const newDice = roll.temporaryDices[index];

  return {
    ...roll,
    temporaryDices: roll.temporaryDices.filter((_, i) => i !== index),
    keptDices: [...roll.keptDices, newDice],
    unresolvedExplosions: newDice.explosion
      ? [
          ...roll.unresolvedExplosions,
          roll.keptDices.filter((dice) => dice.explosion).length,
        ]
      : roll.unresolvedExplosions,
  };
};

export const discardTemporary = async (roll, index) => {
  return {
    ...roll,
    temporaryDices: roll.temporaryDices.filter((_, i) => i !== index),
  };
};
