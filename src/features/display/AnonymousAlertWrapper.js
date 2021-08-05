import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../user/reducer";
import AnonymousAlert from "./AnonymousAlert";

const AnonymousAlertWrapper = ({ children }) => {
  const user = useSelector(selectUser);

  return (
    <>
      {!user && <AnonymousAlert />}
      <>{children}</>
    </>
  );
};

export default AnonymousAlertWrapper;
