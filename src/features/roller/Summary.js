import React from "react";
import { Descriptions, Card } from "antd";
import { Link } from "react-router-dom";

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
      <Descriptions
        title="Declared Intention"
        column={{ md: 3, sm: 1, xs: 1 }}
        bordered
      >
        <Descriptions.Item label="Campaign">
          <Link to={`/rolls?campaign=${campaign}`}>{campaign}</Link>
        </Descriptions.Item>
        <Descriptions.Item label="Character" span={player ? 1 : 2}>
          <Link to={`/rolls?campaign=${campaign}&character=${character}`}>
            {character}
          </Link>
        </Descriptions.Item>
        {player && (
          <Descriptions.Item label="Player">
            <Link to={`/rolls?player=${player.id}`}>{player.name}</Link>
          </Descriptions.Item>
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
