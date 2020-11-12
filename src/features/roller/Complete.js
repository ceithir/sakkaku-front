import React from "react";
import Result from "./Result";
import BbCode from "./BbCode";
import styles from "./Complete.module.css";
import Dices from "./Dices";
import { Typography, Card } from "antd";
import Reroll from "./result/Reroll";
import { hideRerolls } from "./utils";

const { Paragraph } = Typography;

const splitExplosions = ({ dices, baseSize }) => {
  let split = [];
  let remainingDices = [...dices];
  let size = baseSize;
  while (remainingDices.length > 0) {
    const currentDices = remainingDices.slice(0, size);
    currentDices.sort((a, b) => {
      if (a.type === "ring" && b.type === "skill") {
        return -1;
      }
      if (b.type === "ring" && a.type === "skill") {
        return 1;
      }
      return 0;
    });
    remainingDices = remainingDices.slice(size, remainingDices.length);
    size = currentDices.filter(
      ({ status, value: { explosion } }) => status === "kept" && explosion > 0
    ).length;
    split.push(currentDices);
  }
  return split;
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
  const rerollType =
    hasReroll &&
    dices.find(({ status }) => status === "rerolled").metadata.modifier;

  return (
    <div className={styles.container}>
      {hasReroll && (
        <Reroll dices={dices} basePool={basePool} rerollType={rerollType} />
      )}
      <Card bordered={false}>
        <div className="boxed">
          {hasReroll && <Paragraph>{"Result"}</Paragraph>}
          {splitExplosions({
            dices: hideRerolls(dices),
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
                theme="shiny"
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
