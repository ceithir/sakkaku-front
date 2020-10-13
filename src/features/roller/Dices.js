import React from "react";
import { List, Tooltip } from "antd";
import styles from "./Dices.module.css";
import classNames from "classnames";
import Dice from "./Dice";

const Dices = ({ dices }) => {
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
    <List
      grid={{ gutter: 0, column: 10, xs: 5 }}
      dataSource={listData}
      renderItem={({ key, dice, selectable, selected, toggle, disabled }) => {
        const modifier = dice?.metadata?.modifier;
        const rerolled = dice.status === "rerolled";
        const fromReroll = modifier && dice.status !== "rerolled";

        const tooltipText = () => {
          if (rerolled) {
            if (modifier === "adversity") {
              return "Rerolled due to Adversity";
            }
            if (modifier === "distinction") {
              return "Rerolled thanks to Distinction";
            }
          }

          if (fromReroll) {
            return "This dice is the result of a reroll";
          }

          return;
        };

        return (
          <List.Item
            key={key}
            className={classNames(styles.dice, {
              [styles.selectable]: selectable,
              [styles.selected]: selected,
              [styles.unselectable]: disabled,
              [styles.rerolled]: rerolled,
              [styles["from-reroll"]]: fromReroll,
            })}
            onClick={selectable ? toggle : undefined}
          >
            <Tooltip title={tooltipText()}>
              <div>
                <Dice dice={dice} />
              </div>
            </Tooltip>
          </List.Item>
        );
      }}
    />
  );
};

export default Dices;
