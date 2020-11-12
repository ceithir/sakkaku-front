import React from "react";
import Result from "../Result";
import BbCode from "../BbCode";
import styles from "./Resolve.module.css";

const Resolve = ({ dices, tn, description, id, button }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <Result dices={dices} tn={tn} />
        <div className={styles.buttons}>
          {id && (
            <BbCode id={id} dices={dices} tn={tn} description={description} />
          )}
          {button}
        </div>
      </div>
    </div>
  );
};

export default Resolve;
