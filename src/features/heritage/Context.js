import React from "react";
import CharacterSheet from "../display/CharacterSheet";
import styles from "./Context.module.less";

const Context = ({ character, campaign, user, description }) => {
  const data = [
    { label: `Character`, content: character },
    { label: `Campaign`, content: campaign },
    user && { label: `Player`, content: user.name },
    { label: `Description`, content: description },
  ].filter(Boolean);

  return (
    <div className={styles.container}>
      <CharacterSheet data={data} />
    </div>
  );
};

export default Context;
