import React from "react";
import { Alert } from "antd";

const DefaultErrorMessage = () => {
  return (
    <Alert
      message="Something bad happened. Try reloading the page. If things are still broken, please contact administrator through the link at the bottom of the page."
      type="error"
      banner={true}
    />
  );
};

export default DefaultErrorMessage;
