import React, { useState } from "react";
import DicesBox from "../DicesBox";
import NextButton from "../NextButton";
import { replaceRerolls } from "../utils";
import { longname } from "../data/abilities";

const Wandering = ({ dices, onFinish, basePool, rerollTypes }) => {
  const [alterations, setAlterations] = useState([]);
  const positions = alterations.map(({ position }) => position);

  const toggle = (index) => {
    if (alterations.some(({ position }) => position === index)) {
      return setAlterations(
        alterations.filter(({ position }) => position !== index)
      );
    }

    return setAlterations([
      ...alterations,
      { position: index, value: { opportunity: 1 } },
    ]);
  };

  const text = `You may suffer fatigue up to your school rank to alter that many dice to (Opportunity) results.`;

  const buttonText = () => {
    if (alterations.length > 0) {
      return "Alter";
    }

    return "Skip";
  };

  return (
    <DicesBox
      title={longname("wandering")}
      text={text}
      dices={replaceRerolls({
        dices: dices.map((dice, index) => {
          return {
            ...dice,
            selectable: true,
            selected: positions.includes(index),
            disabled: false,
            toggle: () => toggle(index),
          };
        }),
        basePool,
        rerollTypes,
      })}
      footer={
        <NextButton onClick={() => onFinish(alterations)}>
          {buttonText()}
        </NextButton>
      }
      theme="reroll"
    />
  );
};

export default Wandering;
