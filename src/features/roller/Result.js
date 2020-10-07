import React from "react";
import { Typography, List } from "antd";

const { Text } = Typography;

const Result = ({ dices, tn }) => {
  const data = [
    {
      type: "Successes",
      count: dices.reduce(
        (acc, dice) =>
          acc + (dice.value.explosion || 0) + (dice.value.success || 0),
        0
      ),
      target: tn,
    },
    {
      type: "Strifes",
      count: dices.reduce((acc, dice) => acc + (dice.value.strife || 0), 0),
    },
    {
      type: "Opportunities",
      count: dices.reduce(
        (acc, dice) => acc + (dice.value.opportunity || 0),
        0
      ),
    },
  ];

  return (
    <List
      grid={{ gutter: 16, column: 3 }}
      dataSource={data}
      renderItem={({ type, count, target }) => (
        <List.Item>
          <Text
            strong
            type={target && (count >= target ? "success" : "warning")}
          >{`${type}: ${count}`}</Text>
          {target && <Text>{` (required: ${target})`}</Text>}
        </List.Item>
      )}
    />
  );
};

export default Result;
