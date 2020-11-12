import React from "react";
import DicesBox from "../DicesBox";
import { hideRerolls } from "../utils";

const Reroll = ({ dices, basePool }) => {
  return (
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
        dices={hideRerolls(dices)
          .slice(0, basePool)
          .map((dice) => {
            const modifier = dice?.metadata?.modifier;
            const fromReroll = modifier && dice.status !== "rerolled";

            if (fromReroll) {
              return { ...dice, selected: true };
            }

            return dice;
          })}
      />
    </>
  );
};

export default Reroll;
