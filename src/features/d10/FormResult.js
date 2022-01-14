import React, { useRef, useEffect } from "react";
import styles from "./FormResult.module.less";
import RollResult from "./RollResult";
import StandardButtons from "./StandardButtons";
import Loader from "features/navigation/Loader";

const ScrollForm = ({ result, context }) => {
  const refContainer = useRef();

  useEffect(() => {
    refContainer?.current?.scrollIntoView({ behavior: "smooth" });
  }, [refContainer]);

  return (
    <div className={styles.result} ref={refContainer}>
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

const FormResult = ({ result, context, loading }) => {
  if (loading) {
    return <Loader />;
  }

  if (!result) {
    return null;
  }

  return <ScrollForm result={result} context={context} />;
};

export default FormResult;
