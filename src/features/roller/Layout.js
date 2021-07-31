import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../user/reducer";
import AnonymousAlert from "../../AnonymousAlert";
import Title from "../display/Title";
import styles from "./Layout.module.less";

export const CommonLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Title>{`Legend of the Five Rings – Check Roll`}</Title>
      <>{children}</>
    </div>
  );
};

const Layout = ({ children }) => {
  const user = useSelector(selectUser);

  return (
    <>
      {!user && <AnonymousAlert />}
      <CommonLayout>{children}</CommonLayout>
    </>
  );
};

export default Layout;
