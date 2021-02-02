import React from "react";
import Result from "../Result";
import BbCode from "../button/BbCode";
import styles from "./Resolve.module.css";
import Dices from "../Dices";
import { replaceRerolls, orderDices } from "../utils";
import DirectLink from "../button/DirectLink";
import LineContainer from "../button/LineContainer";

const Resolve = ({
  dices,
  tn,
  description,
  id,
  button,
  basePool,
  rerollTypes,
}) => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <Dices
          dices={orderDices(
            replaceRerolls({ dices, basePool, rerollTypes }).filter(
              ({ status }) => status === "kept"
            )
          )}
        />
        <Result dices={dices} tn={tn} modifiers={rerollTypes} />
        <LineContainer>
          <DirectLink id={id} />
          <BbCode
            id={id}
            dices={dices}
            tn={tn}
            description={description}
            modifiers={rerollTypes}
          />
          {button}
        </LineContainer>
      </div>
    </div>
  );
};

export default Resolve;
