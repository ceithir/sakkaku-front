import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectHelp, setHelp } from "../config/reducer";
import { Button } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import classNames from "classnames";
import styles from "./HelpButton.module.less";

const HelpButton = ({ className }) => {
  const active = useSelector(selectHelp);
  const dispatch = useDispatch();

  return (
    <Button
      onClick={() => dispatch(setHelp(!active))}
      className={classNames(styles.button, {
        [styles.active]: active,
        [className]: !!className,
      })}
    >
      <QuestionCircleOutlined />
    </Button>
  );
};

export default HelpButton;
