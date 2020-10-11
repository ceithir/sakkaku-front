import React, { useState } from "react";
import DicesBox from "./DicesBox";
import { Button } from "antd";

const Distinction = ({ dices, onFinish, loading }) => {
  const [toReroll, setToReroll] = useState([]);
  const max = 2;
  const toggle = (index) => {
    if (toReroll.includes(index)) {
      return setToReroll(toReroll.filter((i) => i !== index));
    }
    return setToReroll([...toReroll, index]);
  };

  return (
    <DicesBox
      text={`You can choose up to ${max} dices to reroll.`}
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
        <Button
          type="primary"
          onClick={() => onFinish(toReroll)}
          disabled={loading}
        >
          Continue
        </Button>
      }
    />
  );
};

export default Distinction;
