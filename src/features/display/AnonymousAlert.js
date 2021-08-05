import React from "react";
import { Alert, Affix } from "antd";

const AnonymousAlert = ({ className }) => {
  return (
    <Affix>
      <Alert
        className={className}
        showIcon
        closable
        message={`You are not logged in. No history of your rolls will be kept, and you won't be able to retrieve them later or to share them.`}
        type="warning"
      />
    </Affix>
  );
};

export default AnonymousAlert;
