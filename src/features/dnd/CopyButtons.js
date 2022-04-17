import React from "react";
import { Button, message } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";

const CopyLink = ({ id }) => {
  const buttonText = `Copy link`;

  if (!id) {
    return <Button disabled>{buttonText}</Button>;
  }

  const link = `${window.location.origin}/dnd-rolls/${id}`;

  return (
    <CopyToClipboard
      text={link}
      onCopy={() => message.success("Copied to clipboard!")}
    >
      <Button>{buttonText}</Button>
    </CopyToClipboard>
  );
};

const BbCode = ({ id, description, input, total }) => {
  const buttonText = `Copy as BBCode`;

  if (!id) {
    return <Button disabled>{buttonText}</Button>;
  }

  const link = `${window.location.origin}/dnd-rolls/${id}`;

  const text = `[url="${link}"]${description} | ${input} ⇒ [b]${total}[/b][/url]`;

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => message.success("Copied to clipboard!")}
    >
      <Button>{buttonText}</Button>
    </CopyToClipboard>
  );
};

const CopyButtons = ({ id, description, total, input }) => {
  return (
    <>
      <CopyLink id={id} />
      <BbCode id={id} description={description} input={input} total={total} />
    </>
  );
};

export default CopyButtons;
