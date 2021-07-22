import React, { useState } from "react";
import NextButton from "../NextButton";
import RerollDiceBox from "./RerollDiceBox";
import { bestDiceToReroll } from "../utils";

const Offering = ({
  dices,
  onFinish,
  basePool,
  rerollTypes,
  modifiers,
  mode,
}) => {
  const max = 3;
  const isBlank = ({ value: { opportunity, success, explosion, strife } }) =>
    success === 0 && explosion === 0 && opportunity === 0 && strife === 0;
  const defaultToReroll =
    mode === "semiauto"
      ? bestDiceToReroll({
          roll: { dices, modifiers },
          max,
          restrictFunc: isBlank,
        })
      : [];
  const [toReroll, setToReroll] = useState(defaultToReroll);

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

          return isBlank(dice);
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
