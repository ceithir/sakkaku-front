import React from "react";
import Dices from "../Dices";
import { hideRerolls } from "../utils";
import styles from "./Reroll.module.css";
import { Typography } from "antd";

const { Title } = Typography;

const Reroll = ({ dices, basePool, rerollType }) => {
  const theme = rerollType === "distinction" ? "green" : "orange";
  const title = `${
    rerollType === "distinction" ? "Distinction" : "Adversity"
  } Reroll`;

  return (
    <div className={styles.layout}>
      <Title level={3} className={styles.title}>
        {title}
      </Title>
      <div className={styles.container}>
        <Dices
          dices={dices.slice(0, basePool).map((dice) => {
            return { ...dice, selected: dice.status === "rerolled" };
          })}
          theme={theme}
        />
        <div className={styles["arrow-right"]}>{"⇨"}</div>
        <div className={styles["arrow-down"]}>{"⇩"}</div>
        <Dices
          dices={hideRerolls(dices)
            .slice(0, basePool)
            .map((dice) => {
              const modifier = dice?.metadata?.modifier;
              const fromReroll = modifier && dice.status !== "rerolled";

              if (fromReroll) {
                return { ...dice, selected: true };
              }

              return dice;
            })}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default Reroll;
