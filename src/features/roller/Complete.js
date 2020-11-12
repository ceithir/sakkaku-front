import React from "react";
import styles from "./Complete.module.css";
import Reroll from "./result/Reroll";
import Keep from "./result/Keep";
import Resolve from "./result/Resolve";

const Complete = ({
  dices,
  intent: { tn, ring, skill, modifiers },
  button,
  id,
  description,
}) => {
  const voided = modifiers.includes("void");
  const basePool = ring + skill + (voided ? 1 : 0);
  const hasReroll = dices.some(({ status }) => status === "rerolled");
  const rerollType =
    hasReroll &&
    dices.find(({ status }) => status === "rerolled").metadata.modifier;

  return (
    <div className={styles.container}>
      {hasReroll && (
        <Reroll dices={dices} basePool={basePool} rerollType={rerollType} />
      )}
      <Keep dices={dices} basePool={basePool} />
      <Resolve
        dices={dices}
        tn={tn}
        button={button}
        id={id}
        description={description}
      />
    </div>
  );
};

export default Complete;
