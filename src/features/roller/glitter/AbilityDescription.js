import React from "react";
import { Card, Typography } from "antd";
import styles from "./AbilityDescription.module.css";
import classNames from "classnames";
import manipulatorImage from "./images/abilities/manipulator.png";
import shadowImage from "./images/abilities/shadow.jpg";
import deathdealerImage from "./images/abilities/deathdealer.jpg";
import ishikenImage from "./images/abilities/ishiken.jpg";
import sailorImage from "./images/abilities/sailor.png";
import backgroundImage from "./images/background.jpg";

const ABILITIES = {
  manipulator: {
    name: `Weakness Is My Strength`,
    effect: `When you exploit a target’s disadvantage (see Turning Advantages and Disadvantages, page 100 of the core rulebook) as part of a Scheme action, you do not need to spend a Void point, and you may reroll additional dice up to your school rank.`,
    image: manipulatorImage,
  },
  shadow: {
    name: `Victory before Honor`,
    effect: `Once per scene when performing a check, you may stake an amount of honor no greater than your school rank to re-roll a number of dice equal to twice the amount of honor staked. For each re-rolled die result that does not contain a (success) or (explosion), you forfeit one staked honor.`,
    image: shadowImage,
  },
  deathdealer: {
    name: `Way of the Scorpion`,
    effect: `When you exploit a target’s disadvantage (see Turning Advantages and Disadvantages, page 100 of the core rulebook) as part of an Initiative check for a duel or an Attack action, you do not need to spend a Void point, and you may reroll additional dice up to your school rank.`,
    image: deathdealerImage,
  },
  ishiken: {
    name: `Way of the Void`,
    effect: (
      <>
        <p>
          <strong>Way of the Void (School Ability): </strong>
          <span>
            When you make a check using your Void Ring, after rolling dice, you
            may receive a number of fatigue up to your school rank. If you do,
            you may <strong>pull</strong> or <strong>push</strong>:
          </span>
        </p>
        <p>
          If you <strong>pull</strong>, choose a number of dice with non-blank
          results equal to the fatigue you received, and alter each to a blank
          result.
        </p>
        <p>
          If you <strong>push</strong>, choose a number of dice with blank
          results equal to the fatigue you received, and alter each to a
          non-blank result of your choice.
        </p>
      </>
    ),
    image: ishikenImage,
  },
  sailor: {
    name: `Sailor’s Fortune`,
    effect: `Once per round when making a Trade skill check, if you are not Compromised, you may receive a number of strife up to your school rank to reroll that many rolled dice.`,
    image: sailorImage,
  },
};

const Description = ({ name, effect, image, className }) => {
  return (
    <Card
      className={classNames(styles.card, { [className]: !!className })}
      cover={<img src={image} alt="" />}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Typography className={styles.text}>
        {typeof effect === "string" ? (
          <p>
            <strong>{`${name} (School Ability): `}</strong>
            {effect}
          </p>
        ) : (
          effect
        )}
      </Typography>
    </Card>
  );
};

const AbilityDescription = ({ ability, className }) => {
  if (!ABILITIES[ability]) {
    return null;
  }

  return <Description {...ABILITIES[ability]} className={className} />;
};

export default AbilityDescription;
