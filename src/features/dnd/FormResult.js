import React from "react";
import { Typography } from "antd";
import styles from "./FormResult.module.less";
import { Link } from "react-router-dom";
import CopyButtons from "./CopyButtons";
import TextResult from "./TextResult";

const { Text } = Typography;

export const ResultPlaceholder = () => {
  return (
    <>
      <div className={styles.result}>
        <Text type="secondary">{`Pending…`}</Text>
      </div>
      <Buttons />
    </>
  );
};

const ActualResult = ({ parameters, dice }) => {
  return (
    <div className={styles.result}>
      <TextResult dice={dice} parameters={parameters} />
    </div>
  );
};

const Buttons = ({ id, input, description, total }) => {
  return (
    <div className={styles.buttons}>
      <CopyButtons
        input={input}
        id={id}
        description={description}
        total={total}
      />
      <Link disabled={!id} to={`/dnd-rolls/${id}`}>{`Go to page`}</Link>
    </div>
  );
};

const Result = ({ result, context }) => {
  return (
    <>
      <ActualResult {...result} />
      <Buttons
        id={context?.id}
        input={result.metadata.original}
        description={context?.description}
        total={context?.result?.total}
      />
    </>
  );
};

export default Result;
