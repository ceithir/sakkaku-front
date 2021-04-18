import React from "react";
import { Typography, Descriptions, Card } from "antd";
import TABLES, { entry } from "./data/heritage";
import styles from "./Summary.module.less";

const { Text } = Typography;

const Effect = ({ effect, roll }) => {
  if (typeof effect === "string") {
    return <>{effect}</>;
  }

  const { intro, outro, options } = effect;

  return (
    <>
      <>{intro}</>
      {options.map(({ min, max, text }, index) => {
        return (
          <React.Fragment key={min.toString()}>
            <Text strong={!!roll && min <= roll && max >= roll}>
              {max !== min ? `${min}–${max}: ${text}` : `${min}: ${text}`}
            </Text>
            {index < options.length - 1 && <>{`, `}</>}
          </React.Fragment>
        );
      })}
      <>{outro}</>
    </>
  );
};

const Summary = ({ table, rolls, children, context }) => {
  if (!table || !TABLES[table]) {
    return null;
  }

  const [firstRoll, secondRoll] = rolls;
  const { name, description, modifier, effect } = entry({
    table,
    firstRoll,
    secondRoll,
  });

  return (
    <Card className={styles.container}>
      <Descriptions title={name} bordered layout="vertical" column={3}>
        {context && (
          <>
            {context.character && (
              <>
                <Descriptions.Item label="Character">
                  {context.character}
                </Descriptions.Item>
                <Descriptions.Item label="Campaign">
                  {context.campaign || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Player">
                  {context.user?.name || `N/A`}
                </Descriptions.Item>
              </>
            )}
            {context.description && (
              <Descriptions.Item label="Description" span={3}>
                {context.description}
              </Descriptions.Item>
            )}
          </>
        )}
        <Descriptions.Item label="Result" span={2}>
          {description}
        </Descriptions.Item>
        <Descriptions.Item label="Modifier">{modifier}</Descriptions.Item>
        <Descriptions.Item label="Other effects" span={2}>
          <Effect effect={effect} roll={secondRoll} />
        </Descriptions.Item>
        <Descriptions.Item label="Ref.">
          {TABLES[table]["name"]}
        </Descriptions.Item>
      </Descriptions>
      <>{children}</>
    </Card>
  );
};

export default Summary;
