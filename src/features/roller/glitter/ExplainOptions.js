import React from "react";
import { Collapse } from "antd";
import styles from "./ExplainOptions.module.less";

const { Panel } = Collapse;

const ExplainOptions = ({ options }) => {
  return (
    <Collapse ghost className={styles.container}>
      <Panel header={"What does that mean?"} showArrow={false}>
        {
          <dl>
            {options.map(({ label, description }) => {
              return (
                <>
                  <dt>{label}</dt>
                  <dd>{description}</dd>
                </>
              );
            })}
          </dl>
        }
      </Panel>
    </Collapse>
  );
};

export default ExplainOptions;
