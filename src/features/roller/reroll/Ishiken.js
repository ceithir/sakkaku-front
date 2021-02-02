import React, { useState } from "react";
import DicesBox from "../DicesBox";
import NextButton from "../NextButton";
import { replaceRerolls } from "../utils";
import { Typography } from "antd";
import styles from "./Ishiken.module.css";
import DiceSideSelector from "../DiceSideSelector";

const { Text, Paragraph } = Typography;

const blank = ({ value: { opportunity, strife, success, explosion } }) =>
  opportunity === 0 && strife === 0 && success === 0 && explosion === 0;

const AVAILABLE_FACETS = {
  ring: [
    { opportunity: 1, strife: 1 },
    { opportunity: 1 },
    { success: 1, strife: 1 },
    { success: 1 },
    { explosion: 1, strife: 1 },
  ],
  skill: [
    { opportunity: 1 },
    { success: 1, strife: 1 },
    { success: 1 },
    { explosion: 1, strife: 1 },
    { success: 1, opportunity: 1 },
    { explosion: 1 },
  ],
};

const Ishiken = ({ dices, onFinish, basePool, rerollTypes }) => {
  const [alterations, setAlterations] = useState([]);
  const positions = alterations.map(({ position }) => position);

  const toggle = (index) => {
    if (alterations.some(({ position }) => position === index)) {
      return setAlterations(
        alterations.filter(({ position }) => position !== index)
      );
    }

    const originalDice = dices[index];
    return setAlterations([
      ...alterations,
      { position: index, value: blank(originalDice) ? { success: 1 } : {} },
    ]);
  };

  const onlyBlanks =
    alterations.length > 0 &&
    dices.filter((_, index) => positions.includes(index)).some(blank);
  const onlyNonBlanks = alterations.length > 0 && !onlyBlanks;

  const text = (
    <Paragraph>
      {`Your School Ability allows you to receive a number of fatigue up to your school rank to either:`}
      <ul>
        <li>
          <Text>{`Choose a number of dice with non-blank results equal to the fatigue you received , and alter each to a blank result.`}</Text>
        </li>
        <li>
          <Text>{`Choose a number of dice with blank results equal to the fatigue you received, and alter each to a non-blank result of your choice.`}</Text>
        </li>
      </ul>
    </Paragraph>
  );

  const buttonText = () => {
    if (onlyNonBlanks) {
      return "Pull";
    }

    if (onlyBlanks) {
      return "Push";
    }

    return "Skip";
  };

  return (
    <DicesBox
      text={text}
      dices={replaceRerolls({
        dices: dices.map((dice, index) => {
          const selected = positions.includes(index);
          const selectable =
            (!onlyBlanks && !onlyNonBlanks) ||
            (onlyBlanks && blank(dice)) ||
            (onlyNonBlanks && !blank(dice));
          return {
            ...dice,
            selectable,
            selected,
            disabled: !selectable,
            toggle: () => toggle(index),
          };
        }),
        basePool,
        rerollTypes,
      })}
      footer={
        <>
          {onlyBlanks && (
            <div className={styles.alterators}>
              <Text>{`Choose your desired non-blank result${
                alterations.length > 1 ? "s" : ""
              }`}</Text>
              {alterations.map(({ position, value }) => {
                const type = dices[position]["type"];

                return (
                  <DiceSideSelector
                    key={position.toString()}
                    value={{ type, value }}
                    onChange={({ value }) => {
                      const alt = [...alterations];
                      const index = alt.findIndex(
                        ({ position: pos }) => pos === position
                      );
                      alt[index]["value"] = value;
                      setAlterations(alt);
                    }}
                    facets={AVAILABLE_FACETS[type].map((value) => {
                      return { type, value };
                    })}
                  />
                );
              })}
            </div>
          )}
          <NextButton onClick={() => onFinish(alterations)}>
            {buttonText()}
          </NextButton>
        </>
      }
      theme="reroll"
    />
  );
};

export default Ishiken;
