export const push = async (roll) => {
  // Will do an actual server call in real life
  // Fow now actually handle the whole logic there
  // Without all the important validations

  switch (roll.step) {
    case "intent":
      return { ...roll, step: "roll" };
    default:
      throw new Error(`Step ${roll.step} not implemented`);
  }
};
