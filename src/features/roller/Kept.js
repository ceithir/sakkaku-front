import React from "react";
import DicesBox from "./DicesBox";

const Kept = ({ dices }) => {
  const text = "Dices kept:";

  return (
    <DicesBox
      text={text}
      dices={dices.map((dice) => {
        const selected = dice.status === "kept";
        return {
          ...dice,
          disabled: !selected,
          selected,
        };
      })}
    />
  );
};

export default Kept;
