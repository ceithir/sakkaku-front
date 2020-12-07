import React from "react";
import Dices from "./Dices";
import { orderDices, replaceRerolls } from "./utils";
import { Divider } from "antd";

const splitExplosions = ({ dices, basePool, rerollTypes }) => {
  let split = [];
  let remainingDices = replaceRerolls({ dices, basePool, rerollTypes });
  let size = basePool;
  while (remainingDices.length > 0) {
    const currentDices = orderDices(remainingDices.slice(0, size));
    remainingDices = remainingDices.slice(size, remainingDices.length);
    size = currentDices.filter(
      ({ status, value: { explosion } }) => status === "kept" && explosion > 0
    ).length;
    split.push(currentDices);
  }
  return split;
};

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
