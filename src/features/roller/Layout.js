import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../user/reducer";
import AnonymousAlert from "../../AnonymousAlert";
import Title from "../display/Title";

export const CommonLayout = ({ children }) => {
  return (
    <>
      <Title>{`Legend of the Five Rings – Check Roll`}</Title>
      <>{children}</>
    </>
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
