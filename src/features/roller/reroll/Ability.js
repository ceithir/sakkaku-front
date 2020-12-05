import React, { useState } from "react";
import DicesBox from "../DicesBox";
import NextButton from "../NextButton";
import { hideRerolls } from "../utils";

const Ability = ({ dices, onFinish, text }) => {
  const [toReroll, setToReroll] = useState([]);
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

  return (
    <DicesBox
      text={text}
      dices={hideRerolls(
        dices.map((dice, index) => {
          const selected = toReroll.includes(index);
          return {
            ...dice,
            selectable: true,
            selected,
            disabled: false,
            toggle: () => toggle(index),
          };
        })
      )}
      footer={
        <NextButton onClick={() => onFinish(toReroll)}>
          {buttonText()}
        </NextButton>
      }
      theme="magenta"
    />
  );
};

export default Ability;
