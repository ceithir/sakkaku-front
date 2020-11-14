import React from "react";
import Result from "../Result";
import BbCode from "../button/BbCode";
import styles from "./Resolve.module.css";
import Dices from "../Dices";
import { hideRerolls } from "../utils";
import DirectLink from "../button/DirectLink";

const Resolve = ({ dices, tn, description, id, button }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <Dices
          dices={hideRerolls(dices).filter(({ status }) => status === "kept")}
          className={styles.dices}
        />
        <Result dices={dices} tn={tn} />
        <div className={styles.buttons}>
          <DirectLink id={id} />
          <BbCode id={id} dices={dices} tn={tn} description={description} />
          {button}
        </div>
      </div>
    </div>
  );
};

export default Resolve;