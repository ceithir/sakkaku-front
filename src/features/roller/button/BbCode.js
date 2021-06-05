import React from "react";
import { Button, message } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { countDices } from "../utils";

const imgUrlRoot = `https://sakkaku.org/media/dice`;
const diceToImage = ({
  type,
  value: { opportunity = 0, success = 0, explosion = 0, strife = 0 },
}) => {
  return `${imgUrlRoot}/${type}/exp${explosion}opp${opportunity}str${strife}suc${success}.png`;
};

const BbCode = ({
  id,
  description,
  tn,
  dices,
  modifiers = [],
  cleanedUpDice,
}) => {
  const buttonText = `Copy as BBCode`;

  if (!id) {
    return <Button disabled>{buttonText}</Button>;
  }

  const { successCount, opportunityCount, strifeCount, blankCount } =
    countDices(cleanedUpDice);

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

  const url = `${window.location.origin}/rolls/${id}`;

  const text =
    `[url="${url}"]${description}[/url] | TN: ${tn || "?"} | ${shortResult}` +
    "\n" +
    `[url="${url}"]${cleanedUpDice.map(
      (dice) => `[img]${diceToImage(dice)}[/img]`
    )}[/url]`;

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
