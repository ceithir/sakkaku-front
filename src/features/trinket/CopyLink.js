import React from "react";
import { Button, message } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";

const CopyLink = ({ disabled }) => {
  const buttonText = `Copy link`;

  if (disabled) {
    return <Button disabled>{buttonText}</Button>;
  }

  const text = `${window.location.origin}${window.location.pathname}`;

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => message.success("Copied to clipboard!")}
    >
      <Button>{buttonText}</Button>
    </CopyToClipboard>
  );
};

export default CopyLink;
