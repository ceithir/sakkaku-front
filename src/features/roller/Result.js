import React from "react";
import { Typography, List } from "antd";
import { countDices } from "./utils";
import styles from "./Result.module.css";
import classNames from "classnames";

const { Text } = Typography;

const Result = ({ dices, tn, extra, className }) => {
  const keptDices = dices.filter(({ status }, index) => {
    return status === "kept" || (extra && extra.includes(index));
  });

  const { successCount, opportunityCount, strifeCount } = countDices(keptDices);

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
      className={classNames(styles.layout, { [className]: !!className })}
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
