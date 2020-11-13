import React from "react";
import { Button, message } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { countDices } from "../utils";

const BbCode = ({ id, description, tn, dices }) => {
  const keptDices = dices.filter(({ status }) => {
    return status === "kept";
  });

  const { successCount, opportunityCount, strifeCount } = countDices(keptDices);

  const shortResult = `Success: [b]${successCount}[/b] / Opportunity: [b]${opportunityCount}[/b] / Strife:[b]${strifeCount}[/b] `;

  const text = `[url="${window.location.origin}/rolls/${id}"]${description}[/url] | TN: ${tn} | ${shortResult}`;

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => message.success("Copied to clipboard!")}
    >
      <Button>{`Copy as BBCode`}</Button>
    </CopyToClipboard>
  );
};

export default BbCode;
