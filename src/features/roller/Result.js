import React from "react";
import { Typography, List } from "antd";

const { Text } = Typography;

const Result = ({ dices, tn, extra }) => {
  const keptDices = dices.filter(({ status }, index) => {
    return status === "kept" || (extra && extra.includes(index));
  });

  const successCount = keptDices.reduce(
    (acc, dice) =>
      acc + (dice.value.explosion || 0) + (dice.value.success || 0),
    0
  );
  const opportunityCount = keptDices.reduce(
    (acc, dice) => acc + (dice.value.opportunity || 0),
    0
  );
  const strifeCount = keptDices.reduce(
    (acc, dice) => acc + (dice.value.strife || 0),
    0
  );

  const data = [
    {
      type: "Success",
      count: successCount,
      color: successCount >= tn ? "success" : "warning",
      extra: ` (required: ${tn})`,
    },
    {
      type: "Opportunity",
      count: opportunityCount,
    },
    {
      type: "Strife",
      count: strifeCount,
      color: strifeCount > 0 && "danger",
    },
  ];

  return (
    <List
      grid={{ gutter: 16, column: 3 }}
      dataSource={data}
      renderItem={({ type, count, color, extra }) => (
        <List.Item>
          <Text strong type={color}>{`${type}: ${count}`}</Text>
          {extra && <Text>{extra}</Text>}
        </List.Item>
      )}
    />
  );
};

export default Result;
