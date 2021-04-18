import React from "react";
import { Card, Typography, Image } from "antd";
import styles from "./AbilityDescription.module.css";
import classNames from "classnames";
import backgroundImage from "../../../background.jpg";
import ABILITIES from "../data/abilities";

const Description = ({ name, effect, image, className }) => {
  return (
    <Card
      className={classNames(styles.card, { [className]: !!className })}
      cover={<Image src={image} alt="" preview={false} />}
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
