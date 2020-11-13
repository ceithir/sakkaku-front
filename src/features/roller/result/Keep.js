import React from "react";
import ExplosionDices from "../ExplosionDices";

const Keep = ({ dices, basePool }) => {
  return (
    <ExplosionDices
      className="boxed"
      basePool={basePool}
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

export default Keep;
