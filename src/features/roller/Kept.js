import React from "react";
import DicesBox from "./DicesBox";

const Kept = ({ dices, trulyCompromised }) => {
  const text = trulyCompromised
    ? "You couldn't keep any dice due to being compromised."
    : "You have kept:";

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
