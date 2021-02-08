import React from "react";
import { Typography, Card } from "antd";
import styles from "./Layout.module.css";

const { Text, Title } = Typography;

const Dices = ({ dices }) => {
  return (
    <Card className={styles.dice}>
      <Text>{`Dice:`}</Text>
      {dices.map(({ value, status }, index) => {
        return (
          <Text
            disabled={status === "dropped"}
            strong={status === "kept"}
            key={index.toString()}
          >
            {value}
          </Text>
        );
      })}
    </Card>
  );
};

const Layout = ({ children, dices }) => {
  return (
    <div className={styles.layout}>
      <Title>{`Heritage Roll`}</Title>
      {dices && <Dices dices={dices} />}
      <>{children}</>
    </div>
  );
};

export default Layout;
