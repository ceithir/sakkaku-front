import React from "react";
import styles from "./Dices.module.less";
import classNames from "classnames";
import Dice from "./Dice";

const buildClassNames = ({ dice, theme }) => {
  const { selected, disabled, className } = dice;

  return {
    [styles.selected]: selected,
    [styles.unselectable]: disabled,
    [styles[`theme-${theme}`]]: !!theme,
    [className]: !!className,
  };
};

const StaticDice = ({ dice, theme }) => {
  return (
    <div className={classNames(styles.dice, buildClassNames({ dice, theme }))}>
      <Dice dice={dice} />
    </div>
  );
};

const Dices = ({ dices, theme, className }) => {
  if (!dices?.length) {
    return null;
  }

  const isForm = dices.some(({ selectable }) => selectable);

  if (isForm) {
    return (
      <form className={classNames(styles.dices, { [className]: !!className })}>
        {dices.map((dice, index) => {
          const key = index.toString();
          const { selectable, selected, toggle } = dice;

          if (!selectable) {
            return <StaticDice key={key} dice={dice} theme={theme} />;
          }

          return (
            <label
              key={key}
              className={classNames(styles.dice, {
                [styles.selectable]: true,
                ...buildClassNames({ dice, theme }),
              })}
            >
              <Dice dice={dice} />
              <input type="checkbox" checked={selected} onChange={toggle} />
            </label>
          );
        })}
      </form>
    );
  }

  return (
    <div className={classNames(styles.dices, { [className]: !!className })}>
      {dices.map((dice, index) => {
        return <StaticDice key={index.toString()} dice={dice} theme={theme} />;
      })}
    </div>
  );
};

export default Dices;
