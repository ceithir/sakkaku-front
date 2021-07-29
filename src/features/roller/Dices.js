import React from "react";
import styles from "./Dices.module.less";
import classNames from "classnames";
import Dice from "./Dice";
import TextDice from "./glitter/TextDice";
import { useSelector } from "react-redux";
import { selectDisplayMode } from "./config/reducer";

const buildClassNames = ({ dice, extended }) => {
  const { selected, disabled, className } = dice;

  return {
    [styles.extended]: extended,
    [styles.selected]: selected,
    [styles.unselectable]: disabled,
    [className]: !!className,
  };
};

const WrappedDice = ({ dice, extended }) => {
  if (extended) {
    return (
      <div>
        <Dice dice={dice} />
        <TextDice {...dice.value} />
      </div>
    );
  }
  return <Dice dice={dice} />;
};

const StaticDice = ({ dice, extended }) => {
  return (
    <div
      className={classNames(styles.dice, {
        ...buildClassNames({ dice, extended }),
      })}
    >
      <WrappedDice dice={dice} extended={extended} />
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
            return <StaticDice key={key} dice={dice} extended={extended} />;
          }

          return (
            <label
              key={key}
              className={classNames(styles.dice, {
                [styles.selectable]: true,
                ...buildClassNames({ dice, extended }),
              })}
            >
              <WrappedDice dice={dice} extended={extended} />
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
        return (
          <StaticDice key={index.toString()} dice={dice} extended={extended} />
        );
      })}
    </div>
  );
};

export default Dices;
