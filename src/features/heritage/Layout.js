import React from "react";
import { Typography } from "antd";
import styles from "./Layout.module.less";
import Context from "./Context";

const { Title } = Typography;

const Layout = ({ children, dices, context, instruction }) => {
  return (
    <div className={styles.layout}>
      <Title>{`Legend of the Five Rings – Heritage Roll`}</Title>
      <Context {...context} dices={dices} />
      {instruction && (
        <div className={styles.instruction}>
          <p>{instruction}</p>
        </div>
      )}
      <>{children}</>
    </div>
  );
};

export default Layout;
