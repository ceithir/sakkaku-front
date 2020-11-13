import React from "react";
import { Steps } from "antd";
import styles from "./Steps.module.css";
import classNames from "classnames";

export const DECLARE = "declare";
export const REROLL = "reroll";
export const KEEP = "keep";
export const RESOLVE = "resolve";

const { Step } = Steps;

const CustomSteps = ({ current, className }) => {
  return (
    <Steps
      current={[DECLARE, REROLL, KEEP, RESOLVE].indexOf(current)}
      className={classNames(styles.steps, { [className]: !!className })}
    >
      <Step title={"Declare"} description={"Declare Intention"} />
      <Step title={"Modify"} description={"Modify Rolled Dice"} />
      <Step title={"Keep"} description={"Choose Kept Dice"} />
      <Step title={"Resolve"} description={"Resolve Symbols"} />
    </Steps>
  );
};

export default CustomSteps;
