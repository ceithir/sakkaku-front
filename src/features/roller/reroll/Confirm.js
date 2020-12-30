import React from "react";
import DicesBox from "../DicesBox";
import NextButton from "../NextButton";
import { replaceRerolls } from "../utils";

const Confirm = ({ dices, onFinish, basePool, rerollTypes }) => {
  const text = `Your rolled dice at the moment are as follow.`;

  return (
    <DicesBox
      text={text}
      dices={replaceRerolls({
        dices,
        basePool,
        rerollTypes,
      })}
      footer={<NextButton onClick={() => onFinish()}>{`Continue`}</NextButton>}
    />
  );
};

export default Confirm;
