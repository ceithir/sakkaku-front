import React from "react";
import styles from "./Dices.module.less";
import classNames from "classnames";
import Dice from "./Dice";
import TextDice from "./glitter/TextDice";
import { useSelector } from "react-redux";
import { selectDisplayMode } from "./config/reducer";

const buildClassNames = ({ dice }) => {
  const { selected, disabled, className } = dice;

  return {
    [styles.selected]: selected,
    [styles.unselectable]: disabled,
    [className]: !!className,
  };
};

const StaticDice = ({ dice }) => {
  return (
    <div className={classNames(styles.dice, buildClassNames({ dice }))}>
      <Dice dice={dice} />
    </div>
  );
};

const Dices = ({ dices, className }) => {
  const displayMode = useSelector(selectDisplayMode);
  const extended = displayMode === "verbose";

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
            if (extended) {
              return (
                <div
                  key={key}
                  className={classNames(
                    styles.dice,
                    styles.extended,
                    buildClassNames({ dice })
                  )}
                >
                  <div>
                    <Dice dice={dice} />
                    <TextDice {...dice.value} />
                  </div>
                </div>
              );
            }

            return <StaticDice key={key} dice={dice} />;
          }

          return (
            <label
              key={key}
              className={classNames(styles.dice, {
                [styles.selectable]: true,
                [styles.extended]: extended,
                ...buildClassNames({ dice }),
              })}
            >
              {extended ? (
                <div>
                  <Dice dice={dice} />
                  <TextDice {...dice.value} />
                </div>
              ) : (
                <Dice dice={dice} />
              )}
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
        return <StaticDice key={index.toString()} dice={dice} />;
      })}
    </div>
  );
};

export default Dices;
