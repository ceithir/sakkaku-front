import React from "react";
import { Typography } from "antd";

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
    </>
  );
};

export default TextResult;
