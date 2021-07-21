import React, { useState } from "react";
import NextButton from "../NextButton";
import RerollDiceBox from "./RerollDiceBox";

const Offering = ({ dices, onFinish, basePool, rerollTypes }) => {
  const [toReroll, setToReroll] = useState([]);
  const max = 3;
  const toggle = (index) => {
    if (toReroll.includes(index)) {
      return setToReroll(toReroll.filter((i) => i !== index));
    }
    return setToReroll([...toReroll, index]);
  };
  const text = `You may reroll up to 3 rolled dice showing blank results.`;

  return (
    <RerollDiceBox
      title={`Proper Offerings`}
      text={text}
      dices={dices.map((dice, index) => {
        const selected = toReroll.includes(index);
        const isSelectable = () => {
          if (selected) {
            return true;
          }

          if (toReroll.length === max) {
            return false;
          }

          return (
            dice.value.success === 0 &&
            dice.value.explosion === 0 &&
            dice.value.opportunity === 0 &&
            dice.value.strife === 0
          );
        };
        const selectable = isSelectable();

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
          disabled={toReroll.length > max}
          onClick={() => onFinish(toReroll)}
        >
          {`Continue`}
        </NextButton>
      }
    />
  );
};

export default Offering;
