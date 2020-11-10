import React from "react";
import Result from "./Result";
import DicesBox from "./DicesBox";
import BbCode from "./BbCode";
import styles from "./Complete.module.css";

const Complete = ({ dices, tn, button, id, description, text }) => {
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
          <div className={styles.buttons}>
            {id && (
              <BbCode id={id} dices={dices} tn={tn} description={description} />
            )}
            {button}
          </div>
        </>
      }
    />
  );
};

export default Complete;
