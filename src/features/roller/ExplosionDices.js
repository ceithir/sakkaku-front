import React from "react";
import Dices from "./Dices";
import { Divider } from "antd";
import { splitExplosions } from "./utils";
import styles from "./ExplosionDices.module.less";
import classNames from "classnames";

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
            <Dices
              dices={dices.map((dice) => {
                const {
                  value: { explosion = 0 },
                  className,
                } = dice;

                if (explosion > 0) {
                  return {
                    ...dice,
                    className: classNames(className, styles.explosion),
                  };
                }

                return dice;
              })}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ExplosionDices;
