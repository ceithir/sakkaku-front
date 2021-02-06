import React from "react";
import { Typography, Descriptions, Card } from "antd";
import TABLES from "./tables";

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

const Summary = ({ table, rolls, children }) => {
  if (!table || !TABLES[table]) {
    return null;
  }

  const [firstRoll, secondRoll] = rolls;
  const { name, description, modifier, effect } = TABLES[table]["entries"].find(
    ({ min, max }) => min <= firstRoll && max >= firstRoll
  );

  return (
    <Card>
      <Descriptions title={name} bordered layout="vertical" column={2}>
        <Descriptions.Item label="Result">{description}</Descriptions.Item>
        <Descriptions.Item label="Modifier">{modifier}</Descriptions.Item>
        <Descriptions.Item label="Other effects">
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
