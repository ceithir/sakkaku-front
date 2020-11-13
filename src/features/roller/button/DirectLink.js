import React from "react";
import { Button, message } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";

const DirectLink = ({ id }) => {
  const text = `${window.location.origin}/rolls/${id}`;

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => message.success("Copied to clipboard!")}
    >
      <Button>{`Copy link`}</Button>
    </CopyToClipboard>
  );
};

export default DirectLink;
