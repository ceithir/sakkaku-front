import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "antd";

const GoBackButton = (props) => {
  const history = useHistory();
  return (
    <Button
      onClick={() => {
        history.length > 2 ? history.goBack() : history.push("/rolls");
      }}
      {...props}
    >{`Go back`}</Button>
  );
};

export default GoBackButton;
