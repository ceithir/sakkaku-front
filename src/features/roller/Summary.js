import React from "react";
import { Descriptions, Card } from "antd";

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
      <Descriptions title="Declared Intention" column={3} bordered>
        <Descriptions.Item label="Campaign">{campaign}</Descriptions.Item>
        <Descriptions.Item label="Character">{character}</Descriptions.Item>
        {player && (
          <Descriptions.Item label="Player">{player.name}</Descriptions.Item>
        )}
        <Descriptions.Item label="Description" span={3}>
          {description}
        </Descriptions.Item>
        <Descriptions.Item label="TN">{tn}</Descriptions.Item>
        <Descriptions.Item label="Ring">{ring}</Descriptions.Item>
        <Descriptions.Item label="Skill">{skill}</Descriptions.Item>
        {special && (
          <Descriptions.Item label="Special" span={3}>
            {special}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};

export default Summary;
