import React from "react";
import NextButton from "../NextButton";
import Ability from "./Ability";
import { longname } from "../data/abilities";
import RerollDiceBox from "./RerollDiceBox";

const Sailor = ({ dices, onFinish, basePool, rerollTypes, compromised }) => {
  const title = longname("sailor");

  if (compromised) {
    return (
      <RerollDiceBox
        title={title}
        text={"You may not use your School Ability as you are compromised."}
        dices={dices.map((dice) => {
          return {
            ...dice,
            selectable: false,
            disabled: true,
          };
        })}
        basePool={basePool}
        rerollTypes={rerollTypes}
        footer={
          <NextButton onClick={() => onFinish([])}>{"Continue"}</NextButton>
        }
      />
    );
  }

  return (
    <Ability
      title={title}
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
