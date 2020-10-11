import React, { useState } from "react";
import DicesBox from "./DicesBox";
import { Button } from "antd";

const Keep = ({
  dices,
  max,
  onFinish,
  compromised,
  trulyCompromised,
  loading,
}) => {
  const [toKeep, setToKeep] = useState([]);

  const canKeep = max > toKeep.length;
  const toggle = (index) => {
    if (toKeep.includes(index)) {
      return setToKeep(toKeep.filter((i) => i !== index));
    }
    return setToKeep([...toKeep, index]);
  };
  const text = trulyCompromised
    ? "You cannot keep any dice due to being compromised."
    : `You can choose up to ${max} dice${max > 1 ? "s" : ""} to keep (min 1).`;

  return (
    <DicesBox
      text={text}
      dices={dices.map((dice, index) => {
        const selected = toKeep.includes(index);
        const available =
          dice.status === "pending" && (!compromised || !dice.value.strife);
        const selectable = (selected || canKeep) && available;
        return {
          ...dice,
          selectable,
          selected,
          disabled: !selectable,
          toggle: () => toggle(index),
        };
      })}
      footer={
        (toKeep.length >= 1 || trulyCompromised) && (
          <Button
            type="primary"
            onClick={() => onFinish(toKeep)}
            disabled={loading}
          >
            Continue
          </Button>
        )
      }
    />
  );
};

export default Keep;
