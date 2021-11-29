import React from "react";
import { Button, message } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { stringify } from "./formula";

const CopyLink = ({ id }) => {
  const buttonText = `Copy link`;

  if (!id) {
    return <Button disabled>{buttonText}</Button>;
  }

  const link = `${window.location.origin}/d10-rolls/${id}`;

  return (
    <CopyToClipboard
      text={link}
      onCopy={() => message.success("Copied to clipboard!")}
    >
      <Button>{buttonText}</Button>
    </CopyToClipboard>
  );
};

const BbCode = ({ id, description, roll }) => {
  const { parameters, dice } = roll;
  const { tn } = parameters;
  const total =
    dice
      .filter(({ status }) => status === "kept")
      .reduce((acc, { value }) => acc + value, 0) + (parameters.modifier || 0);

  const buttonText = `Copy as BBCode`;

  if (!id) {
    return <Button disabled>{buttonText}</Button>;
  }

  const link = `${window.location.origin}/d10-rolls/${id}`;

  const text = `[url="${link}"]${description} | ${stringify(
    parameters
  )} ⇒ [b]${total}[/b] (TN: ${tn || "?"})[/url]`;

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => message.success("Copied to clipboard!")}
    >
      <Button>{buttonText}</Button>
    </CopyToClipboard>
  );
};

const StandardButtons = ({ id, description, roll }) => {
  return (
    <>
      <CopyLink id={id} />
      <BbCode id={id} description={description} roll={roll} />
    </>
  );
};

export default StandardButtons;
