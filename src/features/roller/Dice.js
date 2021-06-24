import React from "react";
import { serverRoot } from "../../server";

const imgUrlRoot = `${serverRoot}/media/dice`;
export const diceToImageSrc = (
  { type, value: { opportunity = 0, success = 0, explosion = 0, strife = 0 } },
  resolution = 60
) => {
  return `${imgUrlRoot}/${type}/exp${explosion}opp${opportunity}str${strife}suc${success}-${resolution}.png`;
};

const getText = ({ value: { opportunity, strife, success, explosion } }) => {
  return (
    [
      opportunity && `Opportunity: ${opportunity}`,
      success && `Success: ${success}`,
      explosion && `Explosion: ${explosion}`,
      strife && `Strife: ${strife}`,
    ]
      .filter(Boolean)
      .join("; ") || "Blank"
  );
};

const Dice = ({ dice }) => {
  return <img src={diceToImageSrc(dice)} alt={getText(dice)} />;
};

export default Dice;
