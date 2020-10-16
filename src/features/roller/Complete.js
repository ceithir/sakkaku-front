import React from "react";
import Result from "./Result";
import DicesBox from "./DicesBox";
import BbCode from "./BbCode";

const Complete = ({ dices, tn, footer, id, description, text }) => {
  return (
    <DicesBox
      dices={dices.map((dice) => {
        const selected = dice.status === "kept";
        return {
          ...dice,
          disabled: !selected,
          selected,
        };
      })}
      text={text}
      footer={
        <>
          <Result dices={dices} tn={tn} />
          {id && (
            <BbCode id={id} dices={dices} tn={tn} description={description} />
          )}
          {footer}
        </>
      }
    />
  );
};

export default Complete;
