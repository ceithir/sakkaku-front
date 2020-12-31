import React from "react";
import DicesBox from "../DicesBox";
import NextButton from "../NextButton";
import { replaceRerolls, isAlteration } from "../utils";
import { Button } from "antd";
import LineContainer from "../button/LineContainer";

const Confirm = ({
  dices,
  onFinish,
  basePool,
  rerollTypes,
  addReroll,
  addAlteration,
}) => {
  const text = `Your rolled dice at the moment are as follow.`;

  return (
    <DicesBox
      text={text}
      dices={replaceRerolls({
        dices,
        basePool,
        rerollTypes,
      })}
      footer={
        <LineContainer>
          <Button disabled={!addReroll} onClick={addReroll}>{`Apply ${
            rerollTypes.filter((name) => !isAlteration(name)).length > 0
              ? "another"
              : "a"
          } reroll`}</Button>
          <Button disabled={!addAlteration} onClick={addAlteration}>{`Apply ${
            rerollTypes.filter((name) => isAlteration(name)).length > 0
              ? "another"
              : "an"
          } alteration`}</Button>
          <NextButton onClick={onFinish}>{`Continue`}</NextButton>
        </LineContainer>
      }
    />
  );
};

export default Confirm;
