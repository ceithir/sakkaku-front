import React from "react";
import { Descriptions } from "antd";
import { Link } from "react-router-dom";
import Dice from "./Dice";
import styles from "./Summary.module.css";
import { orderDices } from "./utils";

const Summary = ({
  campaign,
  character,
  description,
  tn,
  ring,
  skill,
  modifiers,
  player,
  channeled,
  addkept,
}) => {
  const special = [
    modifiers.includes("compromised") && "Compromised",
    modifiers.includes("adversity") && "Adversity",
    modifiers.includes("distinction") && "Distinction",
    modifiers.includes("stirring") && "Shūji — Stirring the Embers",
    modifiers.includes("deathdealer") && "Bayushi Deathdealer School Ability",
    modifiers.includes("manipulator") && "Bayushi Manipulator School Ability",
    modifiers.includes("2heavens") &&
      "Attacking a warding Mirumoto Two-Heavens Adept",
    modifiers.includes("ruthless") &&
      "Manual reroll (from NPCs' or other PCs' effects)",
    modifiers.includes("shadow") && "Ikoma Shadow School Ability",
    modifiers.includes("sailor") && "Storm Fleet Sailor School Ability",
    modifiers.includes("ruleless") && "Manual reroll",
    modifiers.includes("ishiken") && "Ishiken Initiate School Ability",
    modifiers.includes("reasonless") && "Manual alteration",
  ]
    .filter(Boolean)
    .join(" / ");

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
      <Descriptions.Item label="Description" span={2}>
        {description}
      </Descriptions.Item>
      <Descriptions.Item label="TN">{tn || "?"}</Descriptions.Item>
      <Descriptions.Item label="Ring">{ring}</Descriptions.Item>
      <Descriptions.Item label="Skill">{skill}</Descriptions.Item>
      <Descriptions.Item label="Voided?">
        {modifiers.includes("void") ? "Yes" : "No"}
      </Descriptions.Item>
      {channeled?.length && (
        <Descriptions.Item label={"Channeled Dice Used"} span={3}>
          <div className={styles.dices}>
            {orderDices(channeled).map((dice, index) => {
              return <Dice key={index.toString()} dice={dice} />;
            })}
          </div>
        </Descriptions.Item>
      )}
      {addkept?.length && (
        <Descriptions.Item label={"Kept Dice Added"} span={3}>
          <div className={styles.dices}>
            {orderDices(addkept).map((dice, index) => {
              return <Dice key={index.toString()} dice={dice} />;
            })}
          </div>
        </Descriptions.Item>
      )}
      {special && (
        <Descriptions.Item label={"Additional Modifiers"} span={3}>
          {special}
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default Summary;
