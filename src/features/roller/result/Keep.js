import React from "react";
import ExplosionDices from "../ExplosionDices";

const Keep = ({ dices, basePool, rerollTypes }) => {
  return (
    <ExplosionDices
      className="boxed"
      basePool={basePool}
      rerollTypes={rerollTypes}
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
