import React, { useState, useEffect } from "react";
import DicesBox from "./DicesBox";
import NextButton from "./NextButton";
import Result from "./Result";

const Keep = ({ dices, max, onFinish, compromised, tn }) => {
  const [toKeep, setToKeep] = useState([]);

  useEffect(() => {
    setToKeep([]);
  }, [dices.length]);

  const keepingExplosions =
    dices.filter((dice) => dice.status === "kept").length > 0;

  const trulyCompromised =
    compromised &&
    dices
      .filter((dice) => dice.status === "pending")
      .every((dice) => dice.value.strife);

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

    if (keepingExplosions) {
      return "Select which explosions you wish to keep (if any).";
    }

    const defaultText = `You can keep up to ${max} dice${
      max > 1 ? "s" : ""
    } (min 1).`;

    if (compromised) {
      return `${defaultText} However, due to being compromised, you cannot keep any dice with strife.`;
    }

    return defaultText;
  };

  const buttonText = () => {
    if (trulyCompromised) {
      return "Continue";
    }

    if (keepingExplosions) {
      if (toKeep.length === 0) {
        return "Don't keep anything else";
      }

      if (toKeep.length === 1) {
        return "Also keep that dice";
      }

      return "Also keep these dices";
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
        const selected = dice.status === "kept" || toKeep.includes(index);
        const available =
          dice.status === "pending" && (!compromised || !dice.value.strife);
        const selectable =
          available && (selected || keepingExplosions || max > toKeep.length);
        const disabled = (() => {
          if (dice.status === "kept") {
            return false;
          }
          if (dice.status !== "pending") {
            return true;
          }
          return !selectable;
        })();
        return {
          ...dice,
          selectable,
          selected,
          disabled,
          toggle: () => toggle(index),
        };
      })}
      footer={
        <>
          <Result dices={dices} tn={tn} extra={toKeep} />
          <NextButton
            onClick={() => onFinish(toKeep)}
            disabled={
              !(keepingExplosions || trulyCompromised) && toKeep.length === 0
            }
          >
            {buttonText()}
          </NextButton>
        </>
      }
    />
  );
};

export default Keep;
