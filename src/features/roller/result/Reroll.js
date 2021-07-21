import React from "react";
import Dices from "../Dices";
import styles from "./Reroll.module.less";
import { Typography, Divider } from "antd";
import {
  replaceRerollsOfType,
  isRerollOfType,
  isFromRerollOfType,
  isSpecialReroll,
  isSpecialAlteration,
  isAlteration,
} from "../utils";
import ABILITIES from "../data/abilities";
import classNames from "classnames";

const { Title, Paragraph } = Typography;

const TITLES = {
  distinction: "Distinction",
  adversity: "Adversity",
  "2heavens": "Enemy Mirumoto Two-Heavens Adept School Ability",
  offering: "Proper Offerings",
};

const getTitle = (name) => {
  if (isSpecialReroll(name)) {
    return "Custom reroll";
  }

  if (isSpecialAlteration(name)) {
    return "Custom alteration";
  }

  if (!!ABILITIES[name]) {
    return `${ABILITIES[name]["school"]} School Ability`;
  }

  return TITLES[name];
};

const getEmptyMessage = (rerollType) => {
  if (["adversity", "2heavens"].includes(rerollType)) {
    return `Nothing was rerolled as there isn't a single die with a success or an explosion.`;
  }

  if (isAlteration(rerollType)) {
    return "No dice were altered.";
  }

  return "No dice were rerolled.";
};

const SingleReroll = ({ dices, basePool, rerollType, rerollTypes }) => {
  if (
    (rerollType === "deathdealer" || rerollType === "manipulator") &&
    rerollTypes.includes("distinction")
  ) {
    return null;
  }

  const title = getTitle(rerollType);

  if (!dices.some((dice) => isRerollOfType(dice, rerollType))) {
    return (
      <div className={styles.layout}>
        <Title level={4} className={styles.title}>
          {title}
        </Title>
        <Paragraph className={styles.empty}>
          {getEmptyMessage(rerollType)}
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
            const selected = isRerollOfType(dice, rerollType);

            return {
              ...dice,
              selected: isRerollOfType(dice, rerollType),
              className: classNames(dice.className, {
                [styles.selected]: selected,
              }),
            };
          })}
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
              return {
                ...dice,
                selected: true,
                className: classNames(dice.className, styles.selected),
              };
            }

            return dice;
          })}
          className={styles.dices}
        />
      </div>
    </div>
  );
};

const Reroll = ({ dices, basePool, rerollTypes, className }) => {
  if (rerollTypes.length === 0) {
    return null;
  }

  return (
    <div className={classNames(styles.box, { [className]: !!className })}>
      {rerollTypes.map((rerollType, i) => {
        return (
          <React.Fragment key={rerollType}>
            <SingleReroll
              dices={dices}
              basePool={basePool}
              rerollType={rerollType}
              rerollTypes={rerollTypes}
            />
            {i < rerollTypes.length - 1 && <Divider />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Reroll;
