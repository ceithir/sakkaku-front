import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../user/reducer";
import AnonymousAlert from "../../AnonymousAlert";
import { Typography } from "antd";
import styles from "./Layout.module.less";
import backgroundImage from "../../background.jpg";

const { Title } = Typography;

const Layout = ({ children }) => {
  const user = useSelector(selectUser);

  return (
    <>
      {!user && <AnonymousAlert />}
      <Title
        className={styles.title}
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >{`Legend of the Five Rings – Check Roll`}</Title>
      <>{children}</>
    </>
  );
};

export default Layout;
