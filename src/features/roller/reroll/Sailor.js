import React from "react";
import NextButton from "../NextButton";
import Ability from "./Ability";
import { Typography, Card } from "antd";

const { Paragraph } = Typography;

const Sailor = ({ dices, onFinish, basePool, rerollTypes, compromised }) => {
  if (compromised) {
    return (
      <Card bordered={false}>
        <div className="boxed">
          <Paragraph>
            {"You may not use your School Ability as you are compromised."}
          </Paragraph>
          <NextButton onClick={() => onFinish([])}>{"Continue"}</NextButton>
        </div>
      </Card>
    );
  }

  return (
    <Ability
      text={
        "You may receive a number of strife up to your school rank to reroll that many rolled dice."
      }
      dices={dices}
      onFinish={onFinish}
      basePool={basePool}
      rerollTypes={rerollTypes}
    />
  );
};

export default Sailor;
