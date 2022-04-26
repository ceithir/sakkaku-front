import React from "react";
import { Typography } from "antd";
import styles from "./FormResult.module.less";
import { Link } from "react-router-dom";
import CopyButtons from "components/aftermath/CopyButtons";
import TextResult from "./TextResult";
import { link, bbMessage } from "./IdentifiedRoll";

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
        link={link(id)}
        bbMessage={bbMessage({ input, description, total })}
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
