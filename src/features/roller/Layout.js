import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../user/reducer";
import AnonymousAlert from "../../AnonymousAlert";
import Title from "../display/Title";

const Layout = ({ children }) => {
  const user = useSelector(selectUser);

  return (
    <>
      {!user && <AnonymousAlert />}
      <Title>{`Legend of the Five Rings – Check Roll`}</Title>
      <>{children}</>
    </>
  );
};

export default Layout;
