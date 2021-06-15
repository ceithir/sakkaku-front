import React from "react";
import { Popover } from "antd";
import styles from "./Hint.module.less";
import classNames from "classnames";

const Hint = ({ text, className }) => {
  return (
    <Popover content={text} trigger="click">
      <sup
        className={classNames(styles.anchor, { [className]: !!className })}
      >{`?`}</sup>
    </Popover>
  );
};

export default Hint;
