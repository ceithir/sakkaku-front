export const groupDice = (dice) => {
  if (!dice.length) {
    return [[]];
  }

  let grouped = [];
  let currentType;
  let currentGroup = [];

  const addGroup = () => {
    grouped.push({
      type: `${currentGroup.length}${currentType}`,
      values: currentGroup,
    });
    currentGroup = [];
  };

  dice
    .filter(({ status }) => status === "kept")
    .forEach(({ type, value }) => {
      if (!currentType) {
        currentType = type;
      }
      if (currentType !== type) {
        addGroup();
        currentType = type;
      }
      currentGroup.push(value);
    });
  addGroup();
  return grouped;
};
