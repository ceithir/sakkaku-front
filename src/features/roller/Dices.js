import React from "react";
import styles from "./Dices.module.css";
import classNames from "classnames";
import Dice from "./Dice";

const Dices = ({ dices, theme }) => {
  if (!dices?.length) {
    return null;
  }
  return (
    <div className={styles.dices}>
      {dices.map((dice, index) => {
        const {
          selectable,
          selected,
          disabled,
          toggle,
          status,
          metadata,
          value,
        } = dice;
        const modifier = metadata?.modifier;
        const rerolled = status === "rerolled";
        const fromReroll = modifier && status !== "rerolled";

        return (
          <div
            key={index.toString()}
            className={classNames(styles.dice, {
              [styles.selectable]: selectable,
              [styles.selected]: selected,
              [styles.unselectable]: disabled,
              [styles.rerolled]: rerolled,
              [styles["from-reroll"]]: fromReroll,
              [styles[`theme-${theme}`]]: !!theme,
              [styles.explosion]: value?.explosion,
            })}
            onClick={selectable ? toggle : undefined}
          >
            <Dice dice={dice} />
          </div>
        );
      })}
    </div>
  );
};

export default Dices;
