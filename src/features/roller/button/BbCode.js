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

  let result = [
    {
      label: "Success",
      value: successCount,
    },
    {
      label: "Opportunity",
      value: opportunityCount,
    },
    {
      label: "Strife",
      value: dices.some(({ metadata }) => metadata?.source === "sailor")
        ? `${strifeCount} + ${
            dices.filter(({ metadata }) => metadata?.source === "sailor").length
          }`
        : strifeCount,
    },
  ];

  if (modifiers.includes("ishiken")) {
    result.push({
      label: "Magnitude",
      value: blankCount,
    });
  }

  const shortResult = result
    .map(({ label, value }) => `${label}: [b]${value}[/b]`)
    .join(" / ");

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
