import React, { useState } from "react";
import DicesBox from "./DicesBox";
import { Button } from "antd";

const KeepExplosions = ({ dices, onFinish }) => {
  const [toKeep, setToKeep] = useState([]);
  const toggle = (index) => {
    if (toKeep.includes(index)) {
      return setToKeep(toKeep.filter((i) => i !== index));
    }
    return setToKeep([...toKeep, index]);
  };

  return (
    <DicesBox
      text={`Select which explosions you wish to keep (if any):`}
      dices={dices.map((dice, index) => {
        return {
          ...dice,
          selectable: dice.status === "pending",
          selected: dice.status === "kept" || toKeep.includes(index),
          disabled: dice.status === "discarded",
          toggle: () => toggle(index),
        };
      })}
      footer={
        <Button type="primary" onClick={() => onFinish(toKeep)}>
          Continue
        </Button>
      }
    />
  );
};

export default KeepExplosions;
