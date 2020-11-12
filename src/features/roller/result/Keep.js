import React from "react";
import Dices from "../Dices";
import { hideRerolls } from "../utils";
import styles from "./Keep.module.css";

const splitExplosions = ({ dices, baseSize }) => {
  let split = [];
  let remainingDices = [...dices];
  let size = baseSize;
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

const Keep = ({ dices, basePool }) => {
  return (
    <div className={styles.layout}>
      {splitExplosions({
        dices: hideRerolls(dices),
        baseSize: basePool,
      }).map((dices, index) => {
        return (
          <Dices
            key={index.toString()}
            dices={dices.map((dice) => {
              const selected = dice.status === "kept";
              return {
                ...dice,
                disabled: !selected,
                selected,
              };
            })}
            theme="shiny"
          />
        );
      })}
    </div>
  );
};

export default Keep;
