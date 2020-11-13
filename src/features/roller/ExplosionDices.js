import React from "react";
import Dices from "./Dices";
import { hideRerolls } from "./utils";
import { Divider } from "antd";

const splitExplosions = ({ dices, basePool }) => {
  let split = [];
  let remainingDices = hideRerolls(dices);
  let size = basePool;
  while (remainingDices.length > 0) {
    const currentDices = remainingDices.slice(0, size);
    currentDices.sort((a, b) => {
      if (a.type === "ring" && b.type === "skill") {
        return -1;
      }
      if (b.type === "ring" && a.type === "skill") {
        return 1;
      }
      return 0;
    });
    remainingDices = remainingDices.slice(size, remainingDices.length);
    size = currentDices.filter(
      ({ status, value: { explosion } }) => status === "kept" && explosion > 0
    ).length;
    split.push(currentDices);
  }
  return split;
};

const ExplosionDices = ({ dices, basePool, className }) => {
  return (
    <div className={className}>
      {splitExplosions({ dices, basePool }).map((dices, index) => {
        return (
          <>
            {index > 0 && <Divider />}
            <Dices key={index.toString()} dices={dices} theme="shiny" />
          </>
        );
      })}
    </div>
  );
};

export default ExplosionDices;
