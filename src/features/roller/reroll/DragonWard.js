import React, { useState } from "react";
import NextButton from "../NextButton";
import RerollDiceBox from "./RerollDiceBox";

const DragonWard = ({ dices, onFinish, basePool, rerollTypes }) => {
  const [toReroll, setToReroll] = useState([]);
  const min = Math.min(
    1,
    dices.filter(
      ({ value: { success, explosion } }) => success > 0 || explosion > 0
    ).length
  );
  const toggle = (index) => {
    if (toReroll.includes(index)) {
      return setToReroll(toReroll.filter((i) => i !== index));
    }
    return setToReroll([...toReroll, index]);
  };
  const text = `You must reroll dice containing success up to the attacked Mirumoto's school rank.`;

  return (
    <RerollDiceBox
      title={"Enemy Mirumoto Two-Heavens Adept"}
      text={text}
      dices={dices.map((dice, index) => {
        const selected = toReroll.includes(index);
        const selectable = dice.value.success > 0 || dice.value.explosion > 0;
        return {
          ...dice,
          selectable,
          selected,
          disabled: !selectable,
          toggle: () => toggle(index),
        };
      })}
      basePool={basePool}
      rerollTypes={rerollTypes}
      footer={
        <NextButton
          disabled={toReroll.length < min}
          onClick={() => onFinish(toReroll)}
        >
          {"Continue"}
        </NextButton>
      }
    />
  );
};

export default DragonWard;
