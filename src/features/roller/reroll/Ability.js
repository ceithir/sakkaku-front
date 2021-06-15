import React, { useState } from "react";
import DicesBox from "../DicesBox";
import NextButton from "../NextButton";
import { replaceRerolls } from "../utils";
import { Button } from "antd";
import styles from "./Ability.module.less";

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
    <DicesBox
      title={title}
      text={text}
      dices={replaceRerolls({
        dices: dices.map((dice, index) => {
          const selected = toReroll.includes(index);
          return {
            ...dice,
            selectable: true,
            selected,
            disabled: false,
            toggle: () => toggle(index),
          };
        }),
        basePool,
        rerollTypes,
      })}
      footer={
        <div className={styles.buttons}>
          {cancel && <Button onClick={cancel}>{`Cancel`}</Button>}
          <NextButton onClick={() => onFinish(toReroll)}>
            {buttonText()}
          </NextButton>
        </div>
      }
      theme="reroll"
    />
  );
};

export default Ability;
