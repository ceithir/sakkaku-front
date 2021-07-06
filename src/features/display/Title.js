import React from "react";
import { Typography } from "antd";
import styles from "./Title.module.less";
import backgroundImage from "../../background.jpg";

const { Title } = Typography;

const CustomTitle = ({ children }) => {
  return (
    <Title
      className={styles.title}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {children}
    </Title>
  );
};

export default CustomTitle;
