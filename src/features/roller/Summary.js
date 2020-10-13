import React from "react";
import { Descriptions, Typography, Card } from "antd";

const { Title } = Typography;

const Summary = ({
  campaign,
  character,
  description,
  tn,
  ring,
  skill,
  modifiers,
  player,
}) => {
  const special = [
    modifiers.includes("void") && "Void Point spent",
    modifiers.includes("compromised") && "Compromised",
    modifiers.includes("adversity") && "Adversity applies",
    modifiers.includes("distinction") && "Distinction applies",
  ]
    .filter(Boolean)
    .join(" – ");

  return (
    <Card>
      <Title level={2}>{`L5R Check`}</Title>
      <Descriptions title="Context" column={3}>
        <Descriptions.Item label="Campaign">{campaign}</Descriptions.Item>
        <Descriptions.Item label="Character">{character}</Descriptions.Item>
        {player && (
          <Descriptions.Item label="Player">{player.name}</Descriptions.Item>
        )}
      </Descriptions>
      <Descriptions title="Parameters" column={2}>
        <Descriptions.Item label="Description" span={2}>
          {description}
        </Descriptions.Item>
        <Descriptions.Item label="TN">{tn}</Descriptions.Item>
        <Descriptions.Item label="Dice Pool">{`Ring ${ring}, Skill ${skill}`}</Descriptions.Item>
        {special && (
          <Descriptions.Item label="Special" span={2}>
            {special}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};

export default Summary;
