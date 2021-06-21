import React, { useState } from "react";
import NextButton from "../NextButton";
import { Button } from "antd";
import styles from "./Ability.module.less";
import RerollDiceBox from "./RerollDiceBox";

const Ability = ({
  dices,
  onFinish,
  text,
  basePool,
  rerollTypes,
  title,
  cancel,
}) => {
  const [toReroll, setToReroll] = useState([]);
  const toggle = (index) => {
    if (toReroll.includes(index)) {
      return setToReroll(toReroll.filter((i) => i !== index));
    }
    return setToReroll([...toReroll, index]);
  };

  const buttonText = () => {
    if (toReroll.length === 0) {
      return "Continue";
    }

    if (toReroll.length === 1) {
      return "Reroll that die";
    }

    return "Reroll these dice";
  };

  return (
    <RerollDiceBox
      title={title}
      text={text}
      dices={dices.map((dice, index) => {
        const selected = toReroll.includes(index);
        return {
          ...dice,
          selectable: true,
          selected,
          disabled: false,
          toggle: () => toggle(index),
        };
      })}
      basePool={basePool}
      rerollTypes={rerollTypes}
      footer={
        <div className={styles.buttons}>
          {cancel && <Button onClick={cancel}>{`Cancel`}</Button>}
          <NextButton
            onClick={() => onFinish(toReroll)}
            disabled={cancel && toReroll.length === 0}
          >
            {buttonText()}
          </NextButton>
        </div>
      }
    />
  );
};

export default Ability;
