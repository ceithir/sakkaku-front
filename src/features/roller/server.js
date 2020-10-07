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
  const dices = rollDices(roll);
  return {
    ...roll,
    dices: dices.map((dice) => {
      return {
        ...dice,
        status: "pending",
      };
    }),
  };
};

export const keep = async (roll, toKeep) => {
  return {
    ...roll,
    dices: roll.dices.map((dice, index) => {
      return {
        ...dice,
        status: toKeep.includes(index) ? "kept" : "discarded",
      };
    }),
  };
};

export const explode = async (roll, index) => {
  const { type, explosion } = roll.dices[index];

  return {
    ...roll,
    dices: roll.dices.map((dice, i) => {
      if (i !== index) {
        return dice;
      }
      return {
        ...dice,
        exploded: true,
      };
    }),
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
    dices: [...roll.dices, { ...newDice, status: "kept" }],
  };
};

export const discardTemporary = async (roll, index) => {
  const newDice = roll.temporaryDices[index];

  return {
    ...roll,
    temporaryDices: roll.temporaryDices.filter((_, i) => i !== index),
    dices: [...roll.dices, { ...newDice, status: "discarded" }],
  };
};
