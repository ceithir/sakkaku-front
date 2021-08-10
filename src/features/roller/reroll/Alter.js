import React, { useState } from "react";
import NextButton from "../NextButton";
import DiceSideSelector from "../DiceSideSelector";
import styles from "./Alter.module.less";
import { Button } from "antd";
import RerollDiceBox from "./RerollDiceBox";
import AddLabel from "./AddLabel";
import AlterationResult from "./AlterationResult";

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

const Alter = ({
  text,
  dices,
  onFinish,
  basePool,
  rerollTypes,
  cancel,
  showLabelInput,
  title,
  modifiers,
}) => {
  const [alterations, setAlterations] = useState([]);
  const positions = alterations.map(({ position }) => position);
  const [label, setLabel] = useState();

  const unrestricted = modifiers.includes("unrestricted");

  const toggle = (index) => {
    if (alterations.some(({ position }) => position === index)) {
      return setAlterations(
        alterations.filter(({ position }) => position !== index)
      );
    }

    return setAlterations([
      ...alterations,
      { position: index, type: dices[index]["type"], value: { success: 1 } },
    ]);
  };

  const buttonText = () => {
    return "Continue";
  };

  return (
    <RerollDiceBox
      title={title}
      text={text}
      dices={dices.map((dice, index) => {
        const selected = positions.includes(index);
        return {
          ...dice,
          selectable: true,
          selected,
          disabled: false,
          toggle: () => toggle(index),
        };
      })}
      basePool={basePool}
      rerollTypes={rerollTypes}
      content={
        <>
          <AlterationResult
            dices={dices}
            rerollTypes={rerollTypes}
            basePool={basePool}
            alterations={alterations}
          />
          {showLabelInput && <AddLabel onChange={setLabel} />}
        </>
      }
      footer={
        <>
          <div className={styles.list}>
            {alterations.map(({ position, value, type }) => {
              const facets = unrestricted
                ? undefined
                : AVAILABLE_FACETS[type].map((value) => {
                    return { type, value };
                  });

              return (
                <DiceSideSelector
                  key={position.toString()}
                  value={{ type, value }}
                  onChange={({ value, type }) => {
                    const alt = [...alterations];
                    const index = alt.findIndex(
                      ({ position: pos }) => pos === position
                    );
                    alt[index]["type"] = type;
                    alt[index]["value"] = value;
                    setAlterations(alt);
                  }}
                  facets={facets}
                />
              );
            })}
          </div>
          <div className={styles.buttons}>
            {cancel && <Button onClick={cancel}>{`Cancel`}</Button>}
            <NextButton
              onClick={() => onFinish(alterations, label)}
              disabled={cancel && alterations.length === 0}
            >
              {buttonText()}
            </NextButton>
          </div>
        </>
      }
    />
  );
};

export default Alter;
