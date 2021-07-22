import React from "react";
import { Typography } from "antd";
import styles from "./Layout.module.less";
import backgroundImage from "../../background.jpg";
import Context from "./Context";
import Breadcrumb from "./Breadcrumb";

const { Title } = Typography;

const Layout = ({ children, dices, context, instruction, alert }) => {
  return (
    <>
      {alert}
      <Breadcrumb {...context} />
      <div
        className={styles.layout}
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <Title>{`Legend of the Five Rings – Heritage Roll`}</Title>
        <Context {...context} dices={dices} />
        {instruction && (
          <div className={styles.instruction}>
            <p>{instruction}</p>
          </div>
        )}
        <>{children}</>
      </div>
    </>
  );
};

export default Layout;
