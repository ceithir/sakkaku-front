import React from "react";
import styles from "./CharacterSheet.module.less";
import { CharacterLink, CampaignLink, PlayerLink } from "../navigation/Links";

const buildData = ({ data, identity }) => {
  if (!identity?.character) {
    return data;
  }

  const { character, campaign, player } = identity;

  return [
    {
      label: `Identity`,
      content: [
        {
          label: `Campaign`,
          content: <CampaignLink campaign={campaign} />,
        },
        {
          label: `Character`,
          content: <CharacterLink campaign={campaign} character={character} />,
        },
        {
          label: `Player`,
          content: <PlayerLink player={player} />,
        },
      ],
    },
    ...data,
  ];
};

const buildDl = (data) => {
  return (
    <dl>
      {data.map(({ label, content }) => {
        return (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{Array.isArray(content) ? buildDl(content) : content}</dd>
          </div>
        );
      })}
    </dl>
  );
};

const CharacterSheet = ({ data, identity }) => {
  return (
    <div className={styles.container}>
      {buildDl(buildData({ data, identity }))}
    </div>
  );
};

export default CharacterSheet;
