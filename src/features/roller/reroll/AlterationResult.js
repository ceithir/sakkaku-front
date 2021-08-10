import React from "react";
import Dices from "../Dices";
import { replaceRerolls } from "../utils";
import styles from "./AlterationResult.module.less";

const AlterationResult = ({ dices, basePool, rerollTypes, alterations }) => {
  if (!alterations.length) {
    return null;
  }

  return (
    <div>
      <div className={styles.arrow}>{"⇩"}</div>
      <Dices
        dices={replaceRerolls({
          dices: dices.map((dice, index) => {
            const alteration = alterations.find(
              ({ position }) => position === index
            );

            return {
              ...dice,
              type: alteration?.type || dice.type,
              value: !!alteration ? alteration.value : dice.value,
              selectable: false,
              selected: !!alteration,
              disabled: false,
            };
          }),
          basePool,
          rerollTypes,
        })}
      />
    </div>
  );
};

export default AlterationResult;
