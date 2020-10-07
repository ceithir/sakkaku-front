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
  const dices = roll.rerolledDices || roll.rolledDices;

  return {
    ...roll,
    keepSelection: toKeep,
    keptDices: dices.filter((_, index) => {
      return toKeep.includes(index);
    }),
  };
};
