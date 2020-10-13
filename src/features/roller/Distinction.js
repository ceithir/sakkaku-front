import React, { useState } from "react";
import DicesBox from "./DicesBox";
import NextButton from "./NextButton";

const Distinction = ({ dices, onFinish }) => {
  const [toReroll, setToReroll] = useState([]);
  const max = 2;
  const toggle = (index) => {
    if (toReroll.includes(index)) {
      return setToReroll(toReroll.filter((i) => i !== index));
    }
    return setToReroll([...toReroll, index]);
  };

  const buttonText = () => {
    if (toReroll.length === 0) {
      return "Don't reroll anything";
    }

    if (toReroll.length === 1) {
      return "Reroll that dice";
    }

    return "Reroll these dices";
  };

  return (
    <DicesBox
      title={`Reroll step`}
      text={
        <>
          Thanks to your <strong>Distinction</strong>, you can select up to{" "}
          {max} dices to be rerolled:
        </>
      }
      dices={dices.map((dice, index) => {
        const selected = toReroll.includes(index);
        const selectable = selected || toReroll.length < max;
        return {
          ...dice,
          selectable,
          selected,
          disabled: !selectable,
          toggle: () => toggle(index),
        };
      })}
      footer={
        <NextButton onClick={() => onFinish(toReroll)}>
          {buttonText()}
        </NextButton>
      }
    />
  );
};

export default Distinction;
