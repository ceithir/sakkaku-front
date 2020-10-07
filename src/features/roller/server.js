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

const rollSameDice = ({ type }) => {
  return {
    type,
    value: rollDice(type === "skill" ? skillDie : ringDie),
    status: "pending",
  };
};

const rollDices = ({ ring, skill }) => {
  return [
    ...[...Array(ring)].map(() => {
      return { type: "ring", value: rollDice(ringDie), status: "pending" };
    }),
    ...[...Array(skill)].map(() => {
      return { type: "skill", value: rollDice(skillDie), status: "pending" };
    }),
  ];
};

// Will do an actual server call in real life
// Fow now actually handle the whole logic there
// Without all the important validations

export const create = async (roll) => {
  return {
    ...roll,
    dices: rollDices(roll),
  };
};

export const keep = async (roll, toKeep) => {
  return {
    ...roll,
    dices: [
      ...roll.dices.map((dice, index) => {
        return {
          ...dice,
          status:
            dice.status === "pending"
              ? toKeep.includes(index)
                ? "kept"
                : "discarded"
              : dice.status,
        };
      }),
      ...roll.dices
        .filter(
          (dice, index) =>
            dice.status === "pending" &&
            toKeep.includes(index) &&
            dice.value.explosion
        )
        .map((dice) => rollSameDice(dice)),
    ],
  };
};
