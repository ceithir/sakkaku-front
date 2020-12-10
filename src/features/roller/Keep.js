import React from "react";
import NextButton from "./NextButton";
import Result from "./Result";
import { Typography } from "antd";
import ExplosionDices from "./ExplosionDices";
import styles from "./Keep.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectToKeep, setToKeep } from "./reducer";

const { Paragraph } = Typography;

const Keep = ({
  dices,
  ring,
  skill,
  voided,
  onFinish,
  compromised,
  tn,
  rerollTypes,
  addkept,
}) => {
  const toKeep = useSelector(selectToKeep);
  const dispatch = useDispatch();

  const max = voided ? ring + 1 : ring;
  const basePool = max + skill;

  const keepingExplosions =
    dices.filter((dice) => dice.status === "kept").length > 0;

  const trulyCompromised =
    compromised &&
    dices
      .filter((dice) => dice.status === "pending")
      .every((dice) => dice.value.strife);

  const showAddKept =
    addkept?.length && !dices.some(({ status }) => status === "kept");

  const toggle = (index) => {
    if (toKeep.includes(index)) {
      return dispatch(setToKeep(toKeep.filter((i) => i !== index)));
    }
    return dispatch(setToKeep([...toKeep, index]));
  };

  const text = () => {
    if (trulyCompromised) {
      return "Being compromised, you cannot keep any die with strife… Which, in this very specific case, means you cannot keep any die at all.";
    }

    if (keepingExplosions) {
      return "Select which explosions you wish to keep (if any).";
    }

    let defaultText =
      max > 1
        ? `You can keep up to ${max} dice (min 1)`
        : "You must choose one die to keep";

    if (addkept?.length) {
      defaultText += " in top of your added dice";
    }

    defaultText += ".";

    if (compromised) {
      return `${defaultText} However, due to being compromised, you cannot keep any die with strife.`;
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
        return "Also keep that die";
      }

      return "Also keep these dice";
    }

    if (toKeep.length === 1) {
      return "Keep that die";
    }

    if (toKeep.length === 0) {
      return "Must select at least one die";
    }

    return "Keep these dice";
  };

  const wrapDices = () => {
    const baseDices = dices.map((dice, index) => {
      const { status, value } = dice;
      const selected = status === "kept" || toKeep.includes(index);
      const available = status === "pending" && (!compromised || !value.strife);
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
    });

    if (showAddKept) {
      return [
        ...baseDices,
        ...addkept.map((dice) => {
          return {
            ...dice,
            status: "pending",
            metadata: { source: "addkept" },
            selected: true,
            selectable: false,
          };
        }),
      ];
    }

    return baseDices;
  };
  const resultDices = () => {
    if (showAddKept) {
      return [
        ...dices,
        ...addkept.map((dice) => {
          return {
            ...dice,
            status: "kept",
          };
        }),
      ];
    }

    return dices;
  };

  return (
    <div className={styles.layout}>
      <ExplosionDices
        dices={wrapDices()}
        basePool={basePool}
        rerollTypes={rerollTypes}
      />
      <Paragraph>{text()}</Paragraph>
      <Result
        dices={resultDices()}
        tn={tn}
        extra={toKeep}
        className={styles.figures}
        modifiers={rerollTypes}
      />
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
