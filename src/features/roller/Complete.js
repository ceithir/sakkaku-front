import React from "react";
import Result from "./Result";
import DicesBox from "./DicesBox";
import BbCode from "./BbCode";
import styles from "./Complete.module.css";
import Dices from "./Dices";
import { Typography, Card } from "antd";

const { Paragraph } = Typography;

const splitExplosions = ({ dices, baseSize }) => {
  let split = [];
  let remainingDices = [...dices];
  let size = baseSize;
  while (remainingDices.length > 0) {
    const currentDices = remainingDices.slice(0, size);
    remainingDices = remainingDices.slice(size, remainingDices.length);
    size = currentDices.filter(
      ({ status, value: { explosion } }) => status === "kept" && explosion > 0
    ).length;
    split.push(currentDices);
  }
  return split;
};

const reorderDices = (dices) => {
  const isAReroll = ({ status }) => status === "rerolled";
  const isFromReroll = ({ status, metadata }) =>
    metadata?.modifier && status !== "rerolled";
  const rerollDices = dices.filter(isFromReroll);

  let i = 0;
  let reorder = [];
  dices.forEach((dice) => {
    if (isFromReroll(dice)) {
      return;
    }

    if (isAReroll(dice)) {
      reorder.push(rerollDices[i]);
      i++;
      return;
    }

    reorder.push(dice);
  });
  return reorder;
};

const Complete = ({
  dices,
  intent: { tn, ring, skill, modifiers },
  button,
  id,
  description,
}) => {
  const voided = modifiers.includes("void");
  const basePool = ring + skill + (voided ? 1 : 0);
  const hasReroll = dices.some(({ status }) => status === "rerolled");
  const dicesWithoutRerolls = reorderDices(dices);

  return (
    <div className={styles.container}>
      {hasReroll && (
        <>
          <DicesBox
            text={"Original roll"}
            dices={dices.slice(0, basePool).map((dice) => {
              return { ...dice, disabled: dice.status === "rerolled" };
            })}
          />
          <DicesBox
            text={"After reroll"}
            theme="gray"
            dices={dicesWithoutRerolls.slice(0, basePool).map((dice) => {
              const modifier = dice?.metadata?.modifier;
              const fromReroll = modifier && dice.status !== "rerolled";

              if (fromReroll) {
                return { ...dice, selected: true };
              }

              return dice;
            })}
          />
        </>
      )}
      <Card bordered={false}>
        <div className="boxed">
          {hasReroll && <Paragraph>{"Result"}</Paragraph>}
          {splitExplosions({
            dices: dicesWithoutRerolls,
            baseSize: basePool,
          }).map((dices, index) => {
            return (
              <Dices
                key={index.toString()}
                dices={dices.map((dice) => {
                  const selected = dice.status === "kept";
                  return {
                    ...dice,
                    disabled: !selected,
                    selected,
                  };
                })}
              />
            );
          })}
          <div className={styles.results}>
            <Result dices={dices} tn={tn} />
            <div className={styles.buttons}>
              {id && (
                <BbCode
                  id={id}
                  dices={dices}
                  tn={tn}
                  description={description}
                />
              )}
              {button}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Complete;
