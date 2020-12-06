import React from "react";
import { Descriptions } from "antd";
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
    modifiers.includes("void") && "Void Point",
    modifiers.includes("compromised") && "Compromised",
    modifiers.includes("adversity") && "Adversity",
    modifiers.includes("distinction") && "Distinction",
    modifiers.includes("stirring") && "Stirring the Embers",
    modifiers.includes("shadow") && "Victory before Honor",
    modifiers.includes("deathdealer") && "Way of the Scorpion",
  ]
    .filter(Boolean)
    .join(" – ");

  return (
    <Descriptions column={{ md: 3, sm: 1, xs: 1 }} bordered>
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
      <Descriptions.Item label="TN">{tn || "?"}</Descriptions.Item>
      <Descriptions.Item label="Ring">{ring}</Descriptions.Item>
      <Descriptions.Item label="Skill">{skill}</Descriptions.Item>
      {special && (
        <Descriptions.Item label="Special" span={3}>
          {special}
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default Summary;
