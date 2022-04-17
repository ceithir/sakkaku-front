import React from "react";
import { Typography } from "antd";
import styles from "./FormResult.module.less";
import { Link } from "react-router-dom";
import CopyButtons from "./CopyButtons";

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
  const keptDice = dice
    .filter(({ status }) => status === "kept")
    .map(({ value }) => value);
  const modifier = parameters.modifier;

  const total = keptDice.reduce((acc, value) => {
    return acc + value;
  }, modifier);

  return (
    <div className={styles.result}>
      <>
        {`${dice
          .filter(({ status }) => status === "kept")
          .map(({ value }) => value)
          .join("+")}`}
        {!!modifier && (
          <>
            {` `}
            <Text code={true}>
              {modifier > 0 ? `+${modifier}` : `${modifier}`}
            </Text>
          </>
        )}
        {` ⇒ `}
      </>
      <Text
        strong={true}
        type={
          parameters.tn
            ? total >= parameters.tn
              ? "success"
              : "danger"
            : undefined
        }
      >
        {total}
      </Text>
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
