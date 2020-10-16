import React from "react";
import { List, Card } from "antd";
import styles from "./Dices.module.css";
import classNames from "classnames";
import Dice from "./Dice";

const Dices = ({ dices, theme }) => {
  if (!dices?.length) {
    return null;
  }

  const listData = dices.map((dice, index) => {
    return {
      key: index.toString(),
      dice,
      selectable: dice.selectable,
      selected: dice.selected,
      toggle: dice.toggle,
      disabled: dice.disabled,
    };
  });

  return (
    <Card className={styles.dices}>
      <List
        grid={{ gutter: 0, column: 7, xs: 4 }}
        dataSource={listData}
        renderItem={({ key, dice, selectable, selected, toggle, disabled }) => {
          const modifier = dice?.metadata?.modifier;
          const rerolled = dice.status === "rerolled";
          const fromReroll = modifier && dice.status !== "rerolled";

          return (
            <List.Item
              key={key}
              className={classNames(styles.dice, {
                [styles.selectable]: selectable,
                [styles.selected]: selected,
                [styles.unselectable]: disabled,
                [styles.rerolled]: rerolled,
                [styles["from-reroll"]]: fromReroll,
                [styles[`theme-${theme}`]]: !!theme,
              })}
              onClick={selectable ? toggle : undefined}
            >
              <Dice dice={dice} />
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

export default Dices;
