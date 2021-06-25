import React from "react";
import { Card, Typography } from "antd";
import styles from "./AbilityDescription.module.less";
import classNames from "classnames";
import backgroundImage from "../../../background.jpg";
import ABILITIES from "../data/abilities";

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
          <>
            <strong>{name}</strong>
            <p>{effect}</p>
          </>
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
