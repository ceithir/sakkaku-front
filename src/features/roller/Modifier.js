import React from "react";
import { reroll, alter, removeModifiers } from "./reducer";
import Distinction from "./reroll/Distinction";
import Adversity from "./reroll/Adversity";
import Ability from "./reroll/Ability";
import Ishiken from "./reroll/Ishiken";
import DragonWard from "./reroll/DragonWard";
import Sailor from "./reroll/Sailor";
import Alter from "./reroll/Alter";
import {
  isSpecialReroll,
  rolledDicesCount,
  isSpecialAlteration,
} from "./utils";
import Result from "./result/Reroll";
import { longname } from "./data/abilities";
import Wandering from "./reroll/Wandering";
import styles from "./Modifier.module.less";
import Offering from "./reroll/Offering";

const Modifier = ({ roll, dispatch }) => {
  const { dices, modifiers, metadata, mode } = roll;

  const compromised = modifiers.includes("compromised");
  const basePool = rolledDicesCount(roll);
  const rerollTypes = metadata?.rerolls || [];

  const shouldShow = (modifier) =>
    modifiers.includes(modifier) && !rerollTypes.includes(modifier);

  if (shouldShow("offering")) {
    return (
      <Offering
        dices={dices}
        onFinish={(positions) => dispatch(reroll(roll, positions, "offering"))}
        basePool={basePool}
        rerollTypes={rerollTypes}
      />
    );
  }

  if (shouldShow("distinction")) {
    return (
      <Distinction
        dices={dices}
        onFinish={(positions) =>
          dispatch(reroll(roll, positions, "distinction"))
        }
        modifiers={modifiers}
        mode={mode}
      />
    );
  }

  if (shouldShow("adversity")) {
    return (
      <Adversity
        dices={dices}
        onFinish={(positions) => dispatch(reroll(roll, positions, "adversity"))}
        modifiers={modifiers}
        mode={mode}
      />
    );
  }
  const AbilityReroll = ({ name, text, ...props }) => {
    return (
      <Ability
        dices={dices}
        onFinish={(positions) => dispatch(reroll(roll, positions, name))}
        text={text}
        basePool={basePool}
        rerollTypes={rerollTypes}
        title={longname(name)}
        {...props}
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
        cancel={() => dispatch(removeModifiers(roll, [specialReroll]))}
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

  if (shouldShow("wandering")) {
    return (
      <Wandering
        dices={dices}
        onFinish={(alterations) =>
          dispatch(alter(roll, alterations, "wandering"))
        }
        basePool={basePool}
        rerollTypes={rerollTypes}
      />
    );
  }

  const specialAlteration = modifiers.find(
    (modifier) => isSpecialAlteration(modifier) && shouldShow(modifier)
  );
  if (specialAlteration) {
    return (
      <Alter
        dices={dices}
        onFinish={(alterations) =>
          dispatch(alter(roll, alterations, specialAlteration))
        }
        basePool={basePool}
        rerollTypes={rerollTypes}
        text={`Custom alteration: Change the result as you want/have to.`}
        cancel={() => dispatch(removeModifiers(roll, [specialAlteration]))}
      />
    );
  }

  return null;
};

const WrappedModifier = ({ roll, dispatch }) => {
  const { dices, metadata } = roll;
  const basePool = rolledDicesCount(roll);
  const rerollTypes = metadata?.rerolls || [];

  return (
    <>
      {rerollTypes.length > 0 && (
        <Result
          dices={dices}
          basePool={basePool}
          rerollTypes={rerollTypes}
          className={styles["previous-rolls"]}
        />
      )}
      <Modifier roll={roll} dispatch={dispatch} />
    </>
  );
};

export default WrappedModifier;
