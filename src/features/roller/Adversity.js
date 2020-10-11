import React, { useState } from "react";
import DicesBox from "./DicesBox";
import { Button } from "antd";

const Adversity = ({ dices, onFinish, loading }) => {
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
      text={`You must reroll two success dices (if possible).`}
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
        toReroll.length >= min && (
          <Button
            type="primary"
            onClick={() => onFinish(toReroll)}
            disabled={loading}
          >
            Continue
          </Button>
        )
      }
    />
  );
};

export default Adversity;
