import React from "react";
import Result from "../Result";
import BbCode from "../button/BbCode";
import styles from "./Resolve.module.less";
import Dices from "../Dices";
import { replaceRerolls, orderDices } from "../utils";
import DirectLink from "../button/DirectLink";
import LineContainer from "../button/LineContainer";
import { Typography } from "antd";

const { Text, Paragraph } = Typography;

const isRelevantDice = ({ status }) =>
  status === "kept" || status === "channeled";
const isASetDice = (dice) =>
  ["channeled", "addkept"].includes(dice?.metadata?.source);

const Resolve = ({
  dices,
  tn,
  description,
  id,
  button,
  basePool,
  rerollTypes,
}) => {
  const isChannel = dices.some(({ status }) => status === "channeled");

  const cleanedUpDice = orderDices(
    replaceRerolls({ dices, basePool, rerollTypes }).filter(isRelevantDice)
  ).map((dice) => {
    if (isASetDice(dice)) {
      return { ...dice, className: styles["set-die"] };
    }

    return dice;
  });

  const setDice = dices.filter(isRelevantDice).filter(isASetDice);

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.content}>
          {isChannel && (
            <Text
              className={styles["channel-text"]}
            >{`The following dice were channeled (reserved) for a later roll.`}</Text>
          )}
          <Dices dices={cleanedUpDice} />
          {setDice.length > 0 && (
            <Paragraph type="secondary">
              {setDice.length > 1
                ? `*These dice were not rolled but set to those values.`
                : `*This die was not rolled but set to that value.`}
            </Paragraph>
          )}
          {!isChannel && (
            <Result dices={dices} tn={tn} modifiers={rerollTypes} />
          )}
        </div>
        <LineContainer>
          <DirectLink id={id} />
          <BbCode
            id={id}
            dices={dices}
            tn={tn}
            description={description}
            modifiers={rerollTypes}
            cleanedUpDice={cleanedUpDice}
          />
          {button}
        </LineContainer>
      </div>
    </div>
  );
};

export default Resolve;
