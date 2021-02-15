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
  channel,
}) => {
  const description = `If need be you may add ${
    rerollTypes.length > 0 ? "extra" : ""
  } effects that modify dice at this step.`;
  const rerollButtonText = `Apply ${
    rerollTypes.filter((name) => !isAlteration(name)).length > 0
      ? "another"
      : "a"
  } reroll`;
  const alterButtonText = `Apply ${
    rerollTypes.filter((name) => isAlteration(name)).length > 0
      ? "another"
      : "an"
  } alteration`;
  const channelButtonText = "Channel";
  const nextButtonText = `Skip`;

  return (
    <DicesBox
      text={description}
      dices={replaceRerolls({
        dices,
        basePool,
        rerollTypes,
      })}
      footer={
        <LineContainer>
          <Button disabled={!addReroll} onClick={addReroll}>
            {rerollButtonText}
          </Button>
          <Button disabled={!addAlteration} onClick={addAlteration}>
            {alterButtonText}
          </Button>
          <Button onClick={channel}>{channelButtonText}</Button>
          <NextButton onClick={onFinish}>{nextButtonText}</NextButton>
        </LineContainer>
      }
    />
  );
};

export default Confirm;
