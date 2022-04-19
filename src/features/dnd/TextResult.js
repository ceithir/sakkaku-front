import React from "react";
import { Typography } from "antd";
import styles from "./TextResult.module.less";

const { Text } = Typography;

const groupDice = (dice) => {
  if (!dice.length) {
    return [[]];
  }

  let grouped = [];
  let currentType;
  let currentGroup = [];

  const addGroup = () => {
    grouped.push({
      type: `${currentGroup.length}${currentType}`,
      values: currentGroup,
    });
    currentGroup = [];
  };

  dice
    .filter(({ status }) => status === "kept")
    .forEach(({ type, value }) => {
      if (!currentType) {
        currentType = type;
      }
      if (currentType !== type) {
        addGroup();
        currentType = type;
      }
      currentGroup.push(value);
    });
  addGroup();
  return grouped;
};

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
