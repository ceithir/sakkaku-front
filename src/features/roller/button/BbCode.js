import React from "react";
import { Button, message } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { countDices } from "../utils";

const BbCode = ({ id, description, tn, dices, modifiers = [] }) => {
  const buttonText = `Copy as BBCode`;

  if (!id) {
    return <Button disabled>{buttonText}</Button>;
  }

  const keptDices = dices.filter(({ status }) => {
    return status === "kept";
  });

  const {
    successCount,
    opportunityCount,
    strifeCount,
    blankCount,
  } = countDices(keptDices);

  let shortResult = `Success: [b]${successCount}[/b] / Opportunity: [b]${opportunityCount}[/b] / Strife: [b]${strifeCount}[/b]`;
  if (modifiers.includes("ishiken")) {
    shortResult += ` / Magnitude: [b]${blankCount}[/b]`;
  }

  const text = `[url="${
    window.location.origin
  }/rolls/${id}"]${description}[/url] | TN: ${tn || "?"} | ${shortResult}`;

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => message.success("Copied to clipboard!")}
    >
      <Button>{buttonText}</Button>
    </CopyToClipboard>
  );
};

export default BbCode;
