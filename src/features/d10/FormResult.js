import React from "react";
import styles from "./FormResult.module.less";
import RollResult from "./RollResult";
import StandardButtons from "./StandardButtons";

const FormResult = ({ result, context }) => {
  if (!result) {
    return null;
  }

  return (
    <div className={styles.result}>
      <RollResult {...result} />
      <div className={styles.buttons}>
        <StandardButtons
          id={context?.id}
          description={context?.description}
          roll={result}
        />
      </div>
    </div>
  );
};

export default FormResult;
