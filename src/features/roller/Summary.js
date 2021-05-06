import React from "react";
import { Typography } from "antd";
import { Link } from "react-router-dom";
import Dice from "./Dice";
import styles from "./Summary.module.less";
import { orderDices, isSpecialReroll, isSpecialAlteration } from "./utils";
import ABILITIES from "./data/abilities";

const { Text } = Typography;

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
    ...[
      modifiers.includes("void") && "Void Point",
      modifiers.includes("compromised") && "Compromised",
      modifiers.includes("adversity") && "Adversity",
      modifiers.includes("distinction") && "Distinction",
      modifiers.includes("stirring") && "Shūji — Stirring the Embers",
    ],
    ...modifiers
      .filter((modifier) => !!ABILITIES[modifier])
      .map((modifier) => `${ABILITIES[modifier]["school"]} School Ability`),
    ...[
      modifiers.includes("2heavens") &&
        "Attacking a warding Mirumoto Two-Heavens Adept",
      modifiers.includes("ruthless") &&
        "Custom reroll (from NPCs' or other PCs' effects)",
      modifiers.some(isSpecialReroll) && "Custom reroll",
      modifiers.some(isSpecialAlteration) && "Custom alteration",
    ],
  ]
    .filter(Boolean)
    .join(" / ");

  const data = [
    player && {
      label: `Identity`,
      content: [
        {
          label: `Campaign`,
          content: <Link to={`/rolls?campaign=${campaign}`}>{campaign}</Link>,
        },
        {
          label: `Character`,
          content: (
            <Link to={`/rolls?campaign=${campaign}&character=${character}`}>
              {character}
            </Link>
          ),
        },
        {
          label: `Player`,
          content: <Link to={`/rolls?player=${player.id}`}>{player.name}</Link>,
        },
      ],
    },
    description && {
      label: `Description`,
      content: description,
    },
    tn && {
      label: `TN`,
      content: <Text className={styles.center}>{tn}</Text>,
    },
    {
      label: `Dice Pool`,
      content: [
        {
          label: `Ring`,
          content: modifiers.includes("void") ? (
            <>
              <Text>{ring}</Text>
              <Text type="secondary">{` + 1`}</Text>
            </>
          ) : (
            ring
          ),
        },
        {
          label: `Skill`,
          content: modifiers.includes("wandering") ? (
            <>
              <Text>{skill}</Text>
              <Text type="secondary">{` + 1`}</Text>
            </>
          ) : (
            skill
          ),
        },
      ],
    },
    special && {
      label: `Modifiers`,
      content: special,
    },
    channeled?.length && {
      label: `Channeled Dice Used`,
      content: (
        <div className={styles.dices}>
          {orderDices(channeled).map((dice, index) => {
            return <Dice key={index.toString()} dice={dice} />;
          })}
        </div>
      ),
    },
    addkept?.length && {
      label: `Kept Dice Added`,
      content: (
        <div className={styles.dices}>
          {orderDices(addkept).map((dice, index) => {
            return <Dice key={index.toString()} dice={dice} />;
          })}
        </div>
      ),
    },
  ].filter(Boolean);

  const buildDescription = (data) => {
    return (
      <dl>
        {data.map(({ label, content }) => {
          return (
            <div>
              <dt>{label}</dt>
              <dd>
                {Array.isArray(content) ? buildDescription(content) : content}
              </dd>
            </div>
          );
        })}
      </dl>
    );
  };

  return <div className={styles.container}>{buildDescription(data)}</div>;
};

export default Summary;
