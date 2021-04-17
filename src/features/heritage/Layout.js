import React from "react";
import { Typography, Card } from "antd";
import styles from "./Layout.module.less";
import AnonymousAlert from "../../AnonymousAlert";
import { useSelector } from "react-redux";
import { selectUser } from "../user/reducer";

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
  const user = useSelector(selectUser);

  return (
    <>
      {!user && <AnonymousAlert />}
      <div className={styles.layout}>
        <Title>{`Heritage Roll`}</Title>
        {dices && <Dices dices={dices} />}
        <>{children}</>
      </div>
    </>
  );
};

export default Layout;
