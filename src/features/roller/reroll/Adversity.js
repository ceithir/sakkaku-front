import React, { useState } from "react";
import DicesBox from "../DicesBox";
import NextButton from "../NextButton";

const Adversity = ({ dices, onFinish }) => {
  const [toReroll, setToReroll] = useState([]);
  const successDices = dices.filter(
    ({ value }) => value.success || value.explosion
  );
  const max = 2;
  const min = Math.min(max, successDices.length);
  const toggle = (index) => {
    if (toReroll.includes(index)) {
      return setToReroll(toReroll.filter((i) => i !== index));
    }
    return setToReroll([...toReroll, index]);
  };

  return (
    <DicesBox
      text={
        <>
          Due to your <strong>Adversity</strong>, you must select two success
          dice (or as much as possible if you don't have two) that will be
          rerolled.
        </>
      }
      dices={dices.map((dice, index) => {
        const selected = toReroll.includes(index);
        const isSuccess = dice.value.success || dice.value.explosion;
        const selectable = isSuccess && (selected || toReroll.length < max);
        return {
          ...dice,
          selectable,
          selected,
          disabled: !selectable,
          toggle: () => toggle(index),
        };
      })}
      footer={
        <NextButton
          disabled={toReroll.length < min}
          onClick={() => onFinish(toReroll)}
        >
          {"Continue"}
        </NextButton>
      }
      theme="orange"
    />
  );
};

export default Adversity;
