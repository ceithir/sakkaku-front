import React, { useState } from "react";
import Dices from "./Dices";
import { Typography, Button } from "antd";

const { Paragraph } = Typography;

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
    <div>
      <Paragraph>{`Please select ${canKeepCount} dice${
        canKeepCount > 1 ? "s" : ""
      }.`}</Paragraph>
      <Dices
        dices={dices.map((dice, index) => {
          const selected = toKeep.includes(index);
          return {
            ...dice,
            selectable: selected || canKeep,
            selected,
            toggle: () => toggle(index),
          };
        })}
      />
      {!canKeep && (
        <Button type="primary" onClick={() => onFinish(toKeep)}>
          Continue
        </Button>
      )}
    </div>
  );
};

export default Keep;
