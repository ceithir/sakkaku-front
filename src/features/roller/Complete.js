import React from "react";
import Result from "./Result";
import DicesBox from "./DicesBox";

const Complete = ({ dices, tn, footer }) => {
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
          {footer}
        </>
      }
    />
  );
};

export default Complete;
