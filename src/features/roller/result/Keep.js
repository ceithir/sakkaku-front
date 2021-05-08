import React from "react";
import ExplosionDices from "../ExplosionDices";
import styles from "./Keep.module.less";

const Keep = ({ dices, basePool, rerollTypes }) => {
  return (
    <div className={styles.container}>
      <ExplosionDices
        basePool={basePool}
        rerollTypes={rerollTypes}
        dices={dices.map((dice) => {
          const selected = dice.status === "kept";
          return {
            ...dice,
            disabled: !selected,
            selected,
          };
        })}
      />
    </div>
  );
};

export default Keep;
