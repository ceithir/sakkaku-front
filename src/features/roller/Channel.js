import React, { useState } from "react";
import DicesBox from "./DicesBox";
import { replaceRerolls } from "./utils";
import { Button } from "antd";
import styles from "./Channel.module.css";

const Channel = ({
  dices,
  onFinish,
  basePool,
  rerollTypes,
  cancel,
  addReroll,
  addAlteration,
}) => {
  const [toChannel, setToChannel] = useState([]);

  const toggle = (index) => {
    if (toChannel.includes(index)) {
      return setToChannel(toChannel.filter((i) => i !== index));
    }
    return setToChannel([...toChannel, index]);
  };

  const text = `Choose the dice you wish to reserve for a later roll (min. 1).`;

  const buttonText = () => {
    if (toChannel.length === 0) {
      return "Must select at least one die";
    }

    if (toChannel.length === 1) {
      return "Channel that die";
    }

    return "Channel these dice";
  };

  return (
    <DicesBox
      text={text}
      dices={replaceRerolls({
        dices: dices.map((dice, index) => {
          const selected = toChannel.includes(index);
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
        <div className={styles.buttons}>
          {!!cancel ? (
            <Button onClick={cancel}>{`Cancel`}</Button>
          ) : (
            <>
              <Button disabled={!addReroll} onClick={addReroll}>
                {`Reroll some dice`}
              </Button>
              <Button disabled={!addAlteration} onClick={addAlteration}>
                {`Alter some dice`}
              </Button>
            </>
          )}
          <Button
            onClick={() => {
              onFinish(toChannel);
            }}
            disabled={toChannel.length === 0}
            type="primary"
          >
            {buttonText()}
          </Button>
        </div>
      }
    />
  );
};

export default Channel;
