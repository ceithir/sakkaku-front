import React from "react";
import { Typography } from "antd";
import styles from "./TextResult.module.less";
import { groupDice } from "./utils";

const { Text } = Typography;

const TextResult = ({ parameters, dice }) => {
  const keptDice = dice
    .filter(({ status }) => status === "kept")
    .map(({ value }) => value);
  const modifier = parameters.modifier;

  const total = keptDice.reduce((acc, value) => {
    return acc + value;
  }, modifier);

  return (
    <>
      <>
        {groupDice(dice).map(({ type, values }, index) => (
          <>
            {index > 0 && ` + `}
            <span className={styles["dice-group"]}>
              <span className={styles.values}>{`${values.join("+")}`}</span>
              <span className={styles.type}>{type}</span>
            </span>
          </>
        ))}
        {!!modifier && <>{modifier > 0 ? ` +${modifier}` : ` ${modifier}`}</>}
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
    </>
  );
};

export default TextResult;
