import React, { useState } from "react";
import DicesBox from "../DicesBox";
import NextButton from "../NextButton";
import { replaceRerolls } from "../utils";
import DiceSideSelector from "../DiceSideSelector";
import styles from "./Alter.module.css";

const AVAILABLE_FACETS = {
  ring: [
    {},
    { opportunity: 1, strife: 1 },
    { opportunity: 1 },
    { success: 1, strife: 1 },
    { success: 1 },
    { explosion: 1, strife: 1 },
  ],
  skill: [
    {},
    { opportunity: 1 },
    { success: 1, strife: 1 },
    { success: 1 },
    { explosion: 1, strife: 1 },
    { success: 1, opportunity: 1 },
    { explosion: 1 },
  ],
};

const Alter = ({ text, dices, onFinish, basePool, rerollTypes }) => {
  const [alterations, setAlterations] = useState([]);
  const positions = alterations.map(({ position }) => position);

  const toggle = (index) => {
    if (alterations.some(({ position }) => position === index)) {
      return setAlterations(
        alterations.filter(({ position }) => position !== index)
      );
    }

    return setAlterations([
      ...alterations,
      { position: index, value: { success: 1 } },
    ]);
  };

  const buttonText = () => {
    return "Continue";
  };

  return (
    <DicesBox
      text={text}
      dices={replaceRerolls({
        dices: dices.map((dice, index) => {
          const selected = positions.includes(index);
          return {
            ...dice,
            selectable: true,
            selected,
            disabled: false,
            toggle: () => toggle(index),
          };
        }),
        basePool,
        rerollTypes,
      })}
      footer={
        <>
          <div className={styles.list}>
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
          <NextButton onClick={() => onFinish(alterations)}>
            {buttonText()}
          </NextButton>
        </>
      }
      theme="reroll"
    />
  );
};

export default Alter;
