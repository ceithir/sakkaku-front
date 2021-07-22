import React from "react";
import CharacterSheet from "../display/CharacterSheet";
import styles from "./Context.module.less";
import classNames from "classnames";
import { CharacterLink, CampaignLink, PlayerLink } from "../navigation/Links";

const Context = ({ character, campaign, user, description, dices = [] }) => {
  const [firstDie, secondDie, thirdDie] = dices;
  const picked = dices.find(({ status }) => status === "kept");

  const data = [
    character && {
      label: `Character`,
      content: <CharacterLink character={character} />,
    },
    campaign && {
      label: `Campaign`,
      content: <CampaignLink campaign={campaign} character={character} />,
    },
    user && { label: `Player`, content: <PlayerLink player={user} /> },
    dices.length > 0 && {
      label: "Dice",
      content: [
        { label: "Rolled", content: `${firstDie.value} / ${secondDie.value}` },
        {
          label: "Picked",
          content: picked?.value || `?`,
        },
        { label: "Effect", content: thirdDie?.value || `?` },
      ],
    },
    description && { label: `Description`, content: description },
  ].filter(Boolean);

  if (data.length === 0) {
    return null;
  }

  return (
    <div
      className={classNames(styles.container, {
        [styles.expanded]: !!character,
      })}
    >
      <CharacterSheet data={data} />
    </div>
  );
};

export default Context;
