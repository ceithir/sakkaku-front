import React from "react";
import DicesBox from "./DicesBox";

const Kept = ({ dices, selection }) => {
  return (
    <DicesBox
      text={`You have kept:`}
      dices={dices.map((dice, index) => {
        const selected = selection.includes(index);
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
