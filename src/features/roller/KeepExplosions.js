import React, { useState, useEffect } from "react";
import DicesBox from "./DicesBox";
import NextButton from "./NextButton";
import Result from "./Result";

const KeepExplosions = ({ dices, onFinish, compromised, tn }) => {
  const [toKeep, setToKeep] = useState([]);

  useEffect(() => {
    setToKeep([]);
  }, [dices.length]);

  const toggle = (index) => {
    if (toKeep.includes(index)) {
      return setToKeep(toKeep.filter((i) => i !== index));
    }
    return setToKeep([...toKeep, index]);
  };

  const buttonText = () => {
    if (toKeep.length === 0) {
      return "Don't keep anything else";
    }

    if (toKeep.length === 1) {
      return "Also keep that dice";
    }

    return "Also keep these dices";
  };

  return (
    <DicesBox
      text={`Select which explosions you wish to keep (if any):`}
      dices={dices.map((dice, index) => {
        const available =
          dice.status === "pending" && (!compromised || !dice.value.strife);

        return {
          ...dice,
          selectable: available,
          selected: dice.status === "kept" || toKeep.includes(index),
          disabled: !available && dice.status !== "kept",
          toggle: () => toggle(index),
        };
      })}
      footer={
        <>
          <Result dices={dices} tn={tn} extra={toKeep} />
          <NextButton onClick={() => onFinish(toKeep)}>
            {buttonText()}
          </NextButton>
        </>
      }
    />
  );
};

export default KeepExplosions;
