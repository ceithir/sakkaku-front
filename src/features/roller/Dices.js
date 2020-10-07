import React from "react";
import { List } from "antd";
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
      grid={{ gutter: 0, column: 10 }}
      dataSource={listData}
      renderItem={({ key, dice, selectable, selected, toggle, disabled }) => (
        <List.Item
          key={key}
          className={classNames(styles.dice, {
            [styles.selectable]: selectable,
            [styles.selected]: selected,
            [styles.unselectable]: (toggle && !selectable) || disabled,
          })}
          onClick={toggle}
        >
          <Dice dice={dice} />
        </List.Item>
      )}
    />
  );
};

export default Dices;
