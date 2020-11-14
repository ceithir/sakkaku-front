import React from "react";
import { Button, message } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";

const DirectLink = ({ id }) => {
  const buttonText = `Copy link`;

  if (!id) {
    return <Button disabled>{buttonText}</Button>;
  }

  const text = `${window.location.origin}/rolls/${id}`;

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => message.success("Copied to clipboard!")}
    >
      <Button>{buttonText}</Button>
    </CopyToClipboard>
  );
};

export default DirectLink;
