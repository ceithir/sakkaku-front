import React from "react";
import Result from "./Result";
import DicesBox from "./DicesBox";
import BbCode from "./BbCode";

const Complete = ({ dices, tn, footer, id, description }) => {
  return (
    <DicesBox
      title={`Check Result`}
      text={`Dices kept, dropped or rerolled:`}
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
