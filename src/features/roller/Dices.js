import React from "react";
import styles from "./Dices.module.css";
import classNames from "classnames";
import Dice from "./Dice";

const Dices = ({ dices, theme, className }) => {
  if (!dices?.length) {
    return null;
  }
  return (
    <div className={classNames(styles.dices, { [className]: !!className })}>
      {dices.map((dice, index) => {
        const { selectable, selected, disabled, toggle, value } = dice;

        return (
          <div
            key={index.toString()}
            className={classNames(styles.dice, {
              [styles.selectable]: selectable,
              [styles.selected]: selected,
              [styles.unselectable]: disabled,
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
