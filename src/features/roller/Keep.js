import React, { useState } from "react";
import DicesBox from "./DicesBox";
import NextButton from "./NextButton";
import Result from "./Result";

const Keep = ({ dices, max, onFinish, compromised, tn }) => {
  const [toKeep, setToKeep] = useState([]);

  const trulyCompromised =
    compromised &&
    dices
      .filter((dice) => dice.status === "pending")
      .every((dice) => dice.value.strife);

  const canKeep = max > toKeep.length;
  const toggle = (index) => {
    if (toKeep.includes(index)) {
      return setToKeep(toKeep.filter((i) => i !== index));
    }
    return setToKeep([...toKeep, index]);
  };

  const text = () => {
    if (trulyCompromised) {
      return "Being compromised, you cannot keep any dice with strife… Which, in this very specific case, means you cannot keep any dice at all.";
    }

    const defaultText = `You can keep up to ${max} dice${
      max > 1 ? "s" : ""
    } (min 1).`;

    if (compromised) {
      return `${defaultText} Due to being compromised, you however cannot keep any dice with strife.`;
    }

    return defaultText;
  };

  const buttonText = () => {
    if (trulyCompromised) {
      return "Continue";
    }

    if (toKeep.length === 1) {
      return "Keep that dice";
    }

    if (toKeep.length === 0) {
      return "Must select at least one dice";
    }

    return "Keep these dices";
  };

  return (
    <DicesBox
      text={text()}
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
        <>
          <Result dices={dices} tn={tn} extra={toKeep} />
          <NextButton
            onClick={() => onFinish(toKeep)}
            disabled={toKeep.length === 0 && !trulyCompromised}
          >
            {buttonText()}
          </NextButton>
        </>
      }
    />
  );
};

export default Keep;
