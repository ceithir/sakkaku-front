import React from "react";
import DicesBox from "./DicesBox";

const Kept = ({ dices }) => {
  return (
    <DicesBox
      text={`You have kept:`}
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
