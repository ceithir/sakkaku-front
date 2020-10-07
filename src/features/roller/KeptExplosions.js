import React from "react";
import DicesBox from "./DicesBox";

const KeptExplosions = ({ keptDices, ring }) => {
  if (keptDices.length <= ring) {
    return null;
  }

  return (
    <DicesBox
      text={`Extra dices from explosions:`}
      dices={keptDices.filter((_, index) => index >= ring)}
    />
  );
};

export default KeptExplosions;
