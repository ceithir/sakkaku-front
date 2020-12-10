import React from "react";
import Dices from "./Dices";
import { Divider } from "antd";
import { splitExplosions } from "./utils";

const ExplosionDices = ({ dices, basePool, className, rerollTypes }) => {
  if (!basePool || basePool > dices.length) {
    throw new Error("Better than infite loop");
  }

  return (
    <div className={className}>
      {splitExplosions({ dices, basePool, rerollTypes }).map((dices, index) => {
        return (
          <React.Fragment key={index.toString()}>
            {index > 0 && <Divider />}
            <Dices dices={dices} theme="shiny" />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ExplosionDices;
