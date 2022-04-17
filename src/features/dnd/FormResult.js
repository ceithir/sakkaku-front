import React from "react";
import { Typography, Button } from "antd";
import styles from "./FormResult.module.less";
import { Link } from "react-router-dom";

const { Text } = Typography;

export const ResultPlaceholder = () => {
  return (
    <div className={styles.result}>
      <Text type="secondary">{`Pending…`}</Text>
    </div>
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

const Buttons = ({ id }) => {
  const disabled = !id;

  return (
    <div className={styles.buttons}>
      <Button disabled={true}>{`Copy link`}</Button>
      <Button disabled={true}>{`Copy as BBCode`}</Button>
      <Link disabled={disabled} to={`/dnd-rolls/${id}`}>{`Go to page`}</Link>
    </div>
  );
};

const Result = ({ result, context }) => {
  return (
    <>
      <ActualResult {...result} />
      <Buttons {...context} />
    </>
  );
};

export default Result;
