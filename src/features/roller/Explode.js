import React from "react";
import DicesBox from "./DicesBox";
import Dice from "./Dice";
import styles from "./Explode.module.css";
import { Button, Typography } from "antd";

const { Text } = Typography;

const Explode = ({ dices, unresolved, roll, temporary, keep, discard }) => {
  return (
    <DicesBox
      text={`Some dices can explode:`}
      dices={dices
        .filter((dice) => dice.explosion)
        .map((dice, index) => {
          return {
            ...dice,
            selectable: unresolved.includes(index) && !temporary?.length,
            toggle: () => roll(index),
          };
        })}
      footer={
        !!temporary?.length &&
        temporary.map((dice, index) => {
          return (
            <div key={index.toString()} className={styles.temporary}>
              <Text>{`Explosion result:`}</Text>
              <Dice dice={dice} />
              <Button
                type="primary"
                onClick={() => keep(index)}
              >{`Keep`}</Button>
              <Button
                danger={true}
                onClick={() => discard(index)}
              >{`Discard`}</Button>
            </div>
          );
        })
      }
    />
  );
};

export default Explode;
