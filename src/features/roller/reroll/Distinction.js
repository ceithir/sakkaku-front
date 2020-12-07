import React, { useState } from "react";
import DicesBox from "../DicesBox";
import NextButton from "../NextButton";

const Distinction = ({ dices, onFinish, modifiers }) => {
  const [toReroll, setToReroll] = useState([]);
  const max = modifiers.includes("stirring") ? 3 : 2;
  const bypassMax =
    modifiers.includes("deathdealer") || modifiers.includes("manipulator");
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
      return "Reroll that die";
    }

    return "Reroll these dice";
  };

  const text = () => {
    if (bypassMax) {
      return `Thanks to your Distinction and your School Ability, you can select up to ${max}+Rank dice to be rerolled.`;
    }

    return `Thanks to your Distinction, you can select up to ${max} dice to be rerolled.`;
  };

  return (
    <DicesBox
      text={text()}
      dices={dices.map((dice, index) => {
        const selected = toReroll.includes(index);
        const selectable = selected || toReroll.length < max || bypassMax;
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
      theme="green"
    />
  );
};

export default Distinction;
