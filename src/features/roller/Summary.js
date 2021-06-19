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
  const modifierToAssist = (modifier) => {
    if (!modifier) {
      return 0;
    }

    return parseInt(modifier.slice(-2));
  };
  const skilledAssist = modifierToAssist(
    modifiers.find((modifier) => /^skilledassist([0-9]{2})$/.test(modifier))
  );
  const unskilledAssist = modifierToAssist(
    modifiers.find((modifier) => /^unskilledassist([0-9]{2})$/.test(modifier))
  );
  const extraRingDice = (modifiers.includes("void") ? 1 : 0) + unskilledAssist;
  const extraSkillDice =
    (modifiers.includes("wandering") ? 1 : 0) + skilledAssist;

  const special = [
    ...[
      modifiers.includes("void") && "Seize the Moment",
      modifiers.includes("compromised") && "Compromised",
      modifiers.includes("adversity") && "Adversity",
      modifiers.includes("distinction") && "Distinction",
      skilledAssist > 0 && `Skilled Assistance x${skilledAssist}`,
      unskilledAssist > 0 && `Unskilled Assistance x${unskilledAssist}`,
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

    {
      label: `Dice Pool`,
      content: [
        {
          label: `Ring`,
          content:
            extraRingDice > 0 ? (
              <>
                <Text>{ring}</Text>
                <Text type="secondary">{` + ${extraRingDice}`}</Text>
              </>
            ) : (
              ring
            ),
        },
        {
          label: `Skill`,
          content:
            extraSkillDice > 0 ? (
              <>
                <Text>{skill}</Text>
                <Text type="secondary">{` + ${extraSkillDice}`}</Text>
              </>
            ) : (
              skill
            ),
        },
      ],
    },
    tn && {
      label: `TN`,
      content: <Text className={styles.center}>{tn}</Text>,
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
            <div key={label}>
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
