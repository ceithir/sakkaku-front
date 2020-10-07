import React, { useState } from "react";
import DicesBox from "./DicesBox";
import { Button } from "antd";

const Keep = ({ dices, onFinish }) => {
  const [toKeep, setToKeep] = useState([]);
  const canKeepCount = dices.filter((dice) => dice.type === "ring").length;
  const canKeep = canKeepCount > toKeep.length;
  const toggle = (index) => {
    if (toKeep.includes(index)) {
      return setToKeep(toKeep.filter((i) => i !== index));
    }
    if (!canKeep) {
      return;
    }
    return setToKeep([...toKeep, index]);
  };

  return (
    <DicesBox
      text={`Please select ${canKeepCount} dice${canKeepCount > 1 ? "s" : ""}.`}
      dices={dices.map((dice, index) => {
        const selected = toKeep.includes(index);
        const selectable = selected || canKeep;
        return {
          ...dice,
          selectable,
          selected,
          disabled: !selectable,
          toggle: () => toggle(index),
        };
      })}
      footer={
        !canKeep && (
          <Button type="primary" onClick={() => onFinish(toKeep)}>
            Continue
          </Button>
        )
      }
    />
  );
};

export default Keep;
