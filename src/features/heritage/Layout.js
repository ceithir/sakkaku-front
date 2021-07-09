import React from "react";
import { Typography, Card } from "antd";
import styles from "./Layout.module.less";
import AnonymousAlert from "../../AnonymousAlert";
import { useSelector } from "react-redux";
import { selectUser } from "../user/reducer";
import backgroundImage from "../../background.jpg";
import Context from "./Context";

const { Text, Title } = Typography;

const Dices = ({ dices }) => {
  return (
    <Card className={styles.dice} size="small">
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

const Layout = ({ children, dices, context }) => {
  const user = useSelector(selectUser);

  return (
    <>
      {!user && <AnonymousAlert />}
      <div
        className={styles.layout}
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <Title>{`Legend of the Five Rings – Heritage Roll`}</Title>
        {dices && <Dices dices={dices} />}
        {context && <Context {...context} />}
        <>{children}</>
      </div>
    </>
  );
};

export default Layout;
