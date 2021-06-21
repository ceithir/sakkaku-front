import React from "react";
import DicesBox from "../DicesBox";
import { replaceRerolls } from "../utils";
import classNames from "classnames";
import styles from "./RerollDiceBox.module.less";

export const diceWrapper = ({ dices, basePool, rerollTypes }) => {
  return replaceRerolls({
    dices: dices.map((dice) => {
      const { selected, selectable, className } = dice;

      return {
        ...dice,
        className: classNames(className, {
          [styles.selected]: selected,
          [styles.selectable]: selectable,
        }),
      };
    }),
    basePool,
    rerollTypes,
  });
};

const RerollDiceBox = ({ dices, basePool, rerollTypes, ...props }) => {
  return (
    <DicesBox
      dices={diceWrapper({
        dices,
        basePool,
        rerollTypes,
      })}
      {...props}
    />
  );
};

export default RerollDiceBox;
