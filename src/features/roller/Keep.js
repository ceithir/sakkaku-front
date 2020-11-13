import React, { useState, useEffect } from "react";
import NextButton from "./NextButton";
import Result from "./Result";
import { Typography } from "antd";
import ExplosionDices from "./ExplosionDices";
import styles from "./Keep.module.css";

const { Paragraph } = Typography;

const Keep = ({ dices, ring, skill, voided, onFinish, compromised, tn }) => {
  const [toKeep, setToKeep] = useState([]);
  useEffect(() => {
    setToKeep([]);
  }, [dices.length]);

  const max = voided ? ring + 1 : ring;
  const basePool = max + skill;

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
    <div className={styles.layout}>
      <Paragraph>{text()}</Paragraph>
      <ExplosionDices
        dices={dices.map((dice, index) => {
          const { status, value } = dice;
          const selected = status === "kept" || toKeep.includes(index);
          const available =
            status === "pending" && (!compromised || !value.strife);
          const selectable =
            available && (selected || keepingExplosions || max > toKeep.length);
          const disabled = (() => {
            if (status === "kept") {
              return false;
            }
            if (status !== "pending") {
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
        basePool={basePool}
      />
      <Result dices={dices} tn={tn} extra={toKeep} />
      <NextButton
        onClick={() => onFinish(toKeep)}
        disabled={
          !(keepingExplosions || trulyCompromised) && toKeep.length === 0
        }
      >
        {buttonText()}
      </NextButton>
    </div>
  );
};

export default Keep;
