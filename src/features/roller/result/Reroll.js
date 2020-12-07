import React from "react";
import Dices from "../Dices";
import styles from "./Reroll.module.css";
import { Typography } from "antd";
import {
  replaceRerollsOfType,
  isRerollOfType,
  isFromRerollOfType,
} from "../utils";

const { Title } = Typography;

const THEMES = {
  distinction: "green",
  adversity: "orange",
};

const TITLES = {
  distinction: "Distinction Reroll",
  adversity: "Adversity Reroll",
  shadow: "Victory before Honor Reroll",
  deathdealer: "Way of the Scorpion Reroll",
  ishiken: "Way of the Void Alteration",
};

const SingleReroll = ({ dices, basePool, rerollType, rerollTypes }) => {
  // Deathdealer can be either a modifier to distinction or a distinct reroll
  if (rerollType === "deathdealer" && rerollTypes.includes("distinction")) {
    return null;
  }

  const theme = THEMES[rerollType] || "magenta";
  const title = TITLES[rerollType];

  const indexOfType = rerollTypes.indexOf(rerollType);
  const previousRerollTypes = rerollTypes.filter(
    (_, index) => index < indexOfType
  );

  const leftDices = () => {
    if (indexOfType <= 0) {
      return dices.slice(0, basePool);
    }
    return replaceRerollsOfType({
      dices,
      rerollType: rerollTypes[indexOfType - 1],
      previousRerollTypes,
      basePool,
    });
  };

  return (
    <div className={styles.layout}>
      <Title level={3} className={styles.title}>
        {title}
      </Title>
      <div className={styles.container}>
        <Dices
          dices={leftDices().map((dice) => {
            return {
              ...dice,
              selected: isRerollOfType(dice, rerollType),
            };
          })}
          theme={theme}
        />
        <div className={styles["arrow-right"]}>{"⇨"}</div>
        <div className={styles["arrow-down"]}>{"⇩"}</div>
        <Dices
          dices={replaceRerollsOfType({
            dices,
            rerollType,
            previousRerollTypes,
            basePool,
          }).map((dice) => {
            if (isFromRerollOfType(dice, rerollType)) {
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

const Reroll = ({ dices, basePool, rerollTypes }) => {
  if (rerollTypes.length === 0) {
    return null;
  }

  return (
    <>
      {rerollTypes.map((rerollType) => {
        return (
          <SingleReroll
            key={rerollType}
            dices={dices}
            basePool={basePool}
            rerollType={rerollType}
            rerollTypes={rerollTypes}
          />
        );
      })}
    </>
  );
};

export default Reroll;
