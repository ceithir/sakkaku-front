import React from "react";
import { reroll, alter, goToKeepStep, addModifiers } from "./reducer";
import Distinction from "./reroll/Distinction";
import Adversity from "./reroll/Adversity";
import Ability from "./reroll/Ability";
import Ishiken from "./reroll/Ishiken";
import DragonWard from "./reroll/DragonWard";
import Sailor from "./reroll/Sailor";
import Alter from "./reroll/Alter";
import Confirm from "./reroll/Confirm";
import { isSpecialReroll, rolledDicesCount } from "./utils";

const Modifier = ({ roll, dispatch }) => {
  const { dices, modifiers, metadata } = roll;

  const compromised = modifiers.includes("compromised");
  const basePool = rolledDicesCount(roll);
  const rerollTypes = metadata?.rerolls || [];

  const shouldShow = (modifier) =>
    modifiers.includes(modifier) && !rerollTypes.includes(modifier);

  if (shouldShow("distinction")) {
    return (
      <Distinction
        dices={dices}
        onFinish={(positions) =>
          dispatch(reroll(roll, positions, "distinction"))
        }
        modifiers={modifiers}
      />
    );
  }

  if (shouldShow("adversity")) {
    return (
      <Adversity
        dices={dices}
        onFinish={(positions) => dispatch(reroll(roll, positions, "adversity"))}
      />
    );
  }
  const AbilityReroll = ({ name, text }) => {
    return (
      <Ability
        dices={dices}
        onFinish={(positions) => dispatch(reroll(roll, positions, name))}
        text={text}
        basePool={basePool}
        rerollTypes={rerollTypes}
      />
    );
  };

  if (shouldShow("deathdealer")) {
    return (
      <AbilityReroll
        name={"deathdealer"}
        text={`Thanks to your School Ability, you may reroll dice up to your school rank.`}
      />
    );
  }

  if (shouldShow("manipulator")) {
    return (
      <AbilityReroll
        name={"manipulator"}
        text={`Thanks to your School Ability, you may reroll dice up to your school rank.`}
      />
    );
  }

  if (shouldShow("2heavens")) {
    return (
      <DragonWard
        dices={dices}
        onFinish={(positions) => dispatch(reroll(roll, positions, "2heavens"))}
        basePool={basePool}
        rerollTypes={rerollTypes}
      />
    );
  }

  if (shouldShow("ruthless")) {
    return (
      <AbilityReroll
        name={"ruthless"}
        text={`Custom reroll: Select the dice you have to reroll.`}
      />
    );
  }

  if (shouldShow("shadow")) {
    return (
      <AbilityReroll
        name={"shadow"}
        text={`Thanks to your School Ability, you can stake honor up to your school rank to re-roll a number of dice equal to twice the amount of honor staked.`}
      />
    );
  }

  if (shouldShow("sailor")) {
    return (
      <Sailor
        dices={dices}
        onFinish={(positions) => dispatch(reroll(roll, positions, "sailor"))}
        basePool={basePool}
        rerollTypes={rerollTypes}
        compromised={compromised}
      />
    );
  }

  const specialReroll = modifiers.find(
    (modifier) => isSpecialReroll(modifier) && shouldShow(modifier)
  );
  if (specialReroll) {
    return (
      <AbilityReroll
        name={specialReroll}
        text={`Custom reroll: Select the dice you want/have to reroll.`}
      />
    );
  }

  if (shouldShow("ishiken")) {
    return (
      <Ishiken
        dices={dices}
        onFinish={(alterations) =>
          dispatch(alter(roll, alterations, "ishiken"))
        }
        basePool={basePool}
        rerollTypes={rerollTypes}
      />
    );
  }

  if (shouldShow("reasonless")) {
    return (
      <Alter
        dices={dices}
        onFinish={(alterations) =>
          dispatch(alter(roll, alterations, "reasonless"))
        }
        basePool={basePool}
        rerollTypes={rerollTypes}
        text={`Custom alteration: Change the result as you want/have to.`}
      />
    );
  }

  const addReroll = () =>
    dispatch(
      addModifiers(roll, [
        `ruleless${modifiers.length.toString().padStart(2, "0")}`,
      ])
    );
  return (
    <Confirm
      dices={dices}
      onFinish={() => dispatch(goToKeepStep())}
      basePool={basePool}
      rerollTypes={rerollTypes}
      addReroll={modifiers.length < 100 && addReroll}
    />
  );
};

export default Modifier;
