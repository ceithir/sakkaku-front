import React from "react";
import CharacterSheet from "features/display/CharacterSheet";
import styles from "./ResultBox.module.less";
import { Divider } from "antd";
import CopyButtons from "./CopyButtons";

const ResultBox = ({
  identity,
  description,
  rollSpecificData,
  link,
  bbMessage,
  children,
}) => {
  return (
    <div className={styles.container}>
      <div>
        <CharacterSheet
          identity={identity}
          description={description}
          data={rollSpecificData}
        />
        {!!children && (
          <>
            <Divider />
            {children}
          </>
        )}
        <Divider />
        <div className={styles.buttons}>
          <CopyButtons link={link} bbMessage={bbMessage} />
        </div>
      </div>
    </div>
  );
};

export default ResultBox;
