import React from "react";
import DicesBox from "../DicesBox";
import { replaceRerolls } from "../utils";
import classNames from "classnames";
import styles from "./RerollDiceBox.module.less";
import { useSelector } from "react-redux";
import { selectHelp } from "../config/reducer";

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

const RerollDiceBox = ({
  dices,
  basePool,
  rerollTypes,
  className,
  ...props
}) => {
  const help = useSelector(selectHelp);

  return (
    <DicesBox
      dices={diceWrapper({
        dices,
        basePool,
        rerollTypes,
      })}
      className={classNames({
        [styles.extended]: help,
        [className]: !!className,
      })}
      {...props}
    />
  );
};

export default RerollDiceBox;
