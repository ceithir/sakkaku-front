import React from "react";
import Dices from "../Dices";
import styles from "./Reroll.module.css";
import { Typography } from "antd";
import {
  replaceRerollsOfType,
  isRerollOfType,
  isFromRerollOfType,
  isSpecialReroll,
  isSpecialAlteration,
} from "../utils";

const { Title, Paragraph } = Typography;

const THEMES = {
  distinction: "green",
  adversity: "orange",
  "2heavens": "orange",
};

const TITLES = {
  distinction: "Distinction",
  adversity: "Adversity",
  shadow: "Ikoma Shadow School Ability",
  deathdealer: "Bayushi Deathdealer School Ability",
  manipulator: "Bayushi Manipulator School Ability",
  ishiken: "Ishiken Initiate School Ability",
  "2heavens": "Enemy Mirumoto Two-Heavens Adept School Ability",
  ruthless: "Custom reroll (from NPCs' or other PCs' effects)",
  sailor: "Storm Fleet Sailor School Ability",
};

const EMPTY = {
  distinction: "No dice were rerolled",
  adversity: "No dice with a success or an explosion",
  "2heavens": "No dice with a success or an explosion",
};

const getTitle = (name) => {
  if (isSpecialReroll(name)) {
    return "Custom reroll";
  }

  if (isSpecialAlteration(name)) {
    return "Custom alteration";
  }

  return TITLES[name];
};

const SingleReroll = ({ dices, basePool, rerollType, rerollTypes }) => {
  if (
    (rerollType === "deathdealer" || rerollType === "manipulator") &&
    rerollTypes.includes("distinction")
  ) {
    return null;
  }

  const theme = THEMES[rerollType] || "magenta";
  const title = getTitle(rerollType);

  if (!dices.some((dice) => isRerollOfType(dice, rerollType))) {
    return (
      <div className={styles.layout}>
        <Title level={4} className={styles.title}>
          {title}
        </Title>
        <Paragraph className={styles.empty}>
          {EMPTY[rerollType] || `Ability not used`}
        </Paragraph>
      </div>
    );
  }

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
      <Title level={4} className={styles.title}>
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
          className={styles.dices}
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
          className={styles.dices}
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
