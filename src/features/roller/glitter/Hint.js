import React from "react";
import { Popover } from "antd";
import styles from "./Hint.module.less";

const Hint = ({ text }) => {
  return (
    <Popover content={text} trigger="click">
      <sup className={styles.anchor}>{`?`}</sup>
    </Popover>
  );
};

export default Hint;
