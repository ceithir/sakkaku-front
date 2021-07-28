import React from "react";
import {
  reroll,
  alter,
  removeModifiers,
  setDelayAfterDistinction,
} from "./reducer";
import Distinction from "./reroll/Distinction";
import Adversity from "./reroll/Adversity";
import Ability from "./reroll/Ability";
import Ishiken from "./reroll/Ishiken";
import DragonWard from "./reroll/DragonWard";
import Alter from "./reroll/Alter";
import {
  isSpecialReroll,
  rolledDicesCount,
  isSpecialAlteration,
  getCustomLabel,
} from "./utils";
import Result from "./result/Reroll";
import { longname } from "./data/abilities";
import Wandering from "./reroll/Wandering";
import styles from "./Modifier.module.less";
import Offering from "./reroll/Offering";

const Modifier = ({ roll, dispatch }) => {
  const { dices, modifiers, metadata, mode } = roll;

  const basePool = rolledDicesCount(roll);
  const rerollTypes = metadata?.rerolls || [];

  const shouldShow = (modifier) =>
    modifiers.includes(modifier) && !rerollTypes.includes(modifier);

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

  const shouldShowDistinction = shouldShow("distinction");
  const { delayAfterDistinction } = roll;
  if (
    shouldShow("offering") &&
    (!delayAfterDistinction || !shouldShowDistinction)
  ) {
    const delay = () => dispatch(setDelayAfterDistinction(true));

    return (
      <Offering
        dices={dices}
        onFinish={(positions) => dispatch(reroll(roll, positions, "offering"))}
        basePool={basePool}
        rerollTypes={rerollTypes}
        modifiers={modifiers}
        mode={mode}
        delay={shouldShowDistinction && delay}
      />
    );
  }

  if (shouldShowDistinction) {
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

  const AbilityReroll = ({ name, text, ...props }) => {
    return (
      <Ability
        dices={dices}
        onFinish={(positions, label) =>
          dispatch(reroll(roll, positions, name, label))
        }
        text={text}
        basePool={basePool}
        rerollTypes={rerollTypes}
        title={longname(name)}
        modifiers={modifiers}
        {...props}
      />
    );
  };

  if (shouldShow("deathdealer")) {
    return (
      <AbilityReroll
        name={"deathdealer"}
        text={`Thanks to your School Ability, you may reroll dice up to your school rank.`}
        shouldPreselectDice={mode === "semiauto"}
      />
    );
  }

  if (shouldShow("manipulator")) {
    return (
      <AbilityReroll
        name={"manipulator"}
        text={`Thanks to your School Ability, you may reroll dice up to your school rank.`}
        shouldPreselectDice={mode === "semiauto"}
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
        modifiers={modifiers}
        mode={mode}
      />
    );
  }

  const specialReroll = modifiers.find(
    (modifier) => isSpecialReroll(modifier) && shouldShow(modifier)
  );
  if (specialReroll) {
    const name = getCustomLabel({ modifier: specialReroll, metadata });

    return (
      <AbilityReroll
        name={specialReroll}
        title={name || `Custom Reroll`}
        text={`Select the dice you want/have to reroll.`}
        cancel={() => dispatch(removeModifiers(roll, [specialReroll]))}
        showLabelInput={!name}
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
    const name = getCustomLabel({ modifier: specialAlteration, metadata });

    return (
      <Alter
        dices={dices}
        onFinish={(alterations, label) =>
          dispatch(alter(roll, alterations, specialAlteration, label))
        }
        basePool={basePool}
        rerollTypes={rerollTypes}
        text={`Change the result as you want/have to.`}
        cancel={() => dispatch(removeModifiers(roll, [specialAlteration]))}
        showLabelInput={!name}
        title={name || `Custom Alteration`}
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
          metadata={metadata}
        />
      )}
      <Modifier roll={roll} dispatch={dispatch} />
    </>
  );
};

export default WrappedModifier;
