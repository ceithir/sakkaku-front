import React from "react";
import Result from "./Result";
import NextButton from "./NextButton";
import DicesBox from "./DicesBox";

const Complete = ({ dices, tn, onClick, footer }) => {
  return (
    <DicesBox
      title={`Check Result`}
      dices={dices.map((dice) => {
        const selected = dice.status === "kept";
        return {
          ...dice,
          disabled: !selected,
          selected,
        };
      })}
      footer={
        <>
          <Result dices={dices} tn={tn} />
          <NextButton onClick={onClick}>New roll</NextButton>
          {footer}
        </>
      }
    />
  );
};

export default Complete;
