import React from "react";
import styles from "./CharacterSheet.module.less";

const CharacterSheet = ({ data }) => {
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

  return <div className={styles.container}>{buildDl(data)}</div>;
};

export default CharacterSheet;
