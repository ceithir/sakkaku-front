import React, { useEffect, useState } from "react";
import Intent from "./Intent";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAll,
  create,
  softReset,
  keep,
  reroll,
  selectStep,
  selectIntent,
  alter,
  setAddKept,
  goToKeepStep,
  addModifiers,
} from "./reducer";
import Keep from "./Keep";
import Distinction from "./reroll/Distinction";
import Adversity from "./reroll/Adversity";
import Ability from "./reroll/Ability";
import Ishiken from "./reroll/Ishiken";
import DragonWard from "./reroll/DragonWard";
import Sailor from "./reroll/Sailor";
import Alter from "./reroll/Alter";
import Confirm from "./reroll/Confirm";
import Summary from "./Summary";
import { Collapse } from "antd";
import styles from "./index.module.css";
import { setParameters, load } from "./reducer";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import NextButton from "./NextButton";
import { selectUser } from "../user/reducer";
import Steps, { DECLARE, REROLL, KEEP, RESOLVE } from "./Steps";
import RerollResult from "./result/Reroll";
import KeepResult from "./result/Keep";
import ResolveResult from "./result/Resolve";
import AnonymousAlert from "./AnonymousAlert";
import { REROLL_TYPES } from "./utils";

const { Panel } = Collapse;

const Layout = ({ children }) => {
  const user = useSelector(selectUser);
  const currentStep = useSelector(selectStep);

  return (
    <>
      {!user && <AnonymousAlert className={styles.alert} />}
      <Steps current={currentStep} className={styles.steps} />
      <>{children}</>
    </>
  );
};

const Roller = ({ save }) => {
  const roll = useSelector(selectAll);
  const user = useSelector(selectUser);
  const currentStep = useSelector(selectStep);
  const intent = useSelector(selectIntent);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!save || !dispatch) {
      return;
    }
    dispatch(setParameters({ ...save, ...save.roll.parameters }));
    dispatch(
      load({
        id: save.id,
        dices: save.roll.dices,
        metadata: save.roll.metadata,
        player: save.user,
      })
    );
  }, [save, dispatch]);

  const [activeKeys, setActiveKeys] = useState([DECLARE]);
  useEffect(() => {
    // FIXME: Naming inconsistency
    if (currentStep === REROLL) {
      setActiveKeys(["modify"]);
      return;
    }
    setActiveKeys([currentStep]);
  }, [currentStep]);

  const {
    dices,
    tn,
    modifiers,
    ring,
    skill,
    error,
    id,
    description,
    metadata,
    addkept,
  } = roll;

  const compromised = modifiers.includes("compromised");
  const voided = modifiers.includes("void");
  const basePool = ring + skill + (voided ? 1 : 0);
  const rerollTypes = metadata?.rerolls || [];

  if (error) {
    return <DefaultErrorMessage />;
  }

  const disabled = (panel) => {
    if (currentStep === panel) {
      return false;
    }

    if (panel === RESOLVE) {
      return currentStep !== RESOLVE;
    }

    if (panel === KEEP) {
      return ![KEEP, RESOLVE].includes(currentStep);
    }

    if (panel === REROLL) {
      if (currentStep === DECLARE) {
        return true;
      }

      return !modifiers.some((mod) => REROLL_TYPES.includes(mod));
    }

    return false;
  };

  const PanelContent = ({ name }) => {
    if (disabled(name)) {
      return null;
    }

    if (name === RESOLVE) {
      return (
        <ResolveResult
          dices={dices}
          tn={tn}
          button={
            <NextButton onClick={() => dispatch(softReset())}>
              New roll
            </NextButton>
          }
          id={id}
          description={description}
          basePool={basePool}
          rerollTypes={rerollTypes}
        />
      );
    }

    if (name === KEEP) {
      if (currentStep === KEEP) {
        return (
          <Keep
            dices={dices}
            onFinish={(toKeep, toAdd) => dispatch(keep(roll, toKeep, toAdd))}
            tn={tn}
            ring={ring}
            skill={skill}
            rerollTypes={rerollTypes}
            addkept={addkept}
            setAddKept={(data) => dispatch(setAddKept(data))}
            modifiers={modifiers}
          />
        );
      }
      return (
        <KeepResult
          dices={dices}
          basePool={basePool}
          rerollTypes={rerollTypes}
        />
      );
    }

    if (name === REROLL) {
      const shouldShow = (modifier) =>
        modifiers.includes(modifier) && !rerollTypes.includes(modifier);

      if (currentStep === REROLL) {
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
              onFinish={(positions) =>
                dispatch(reroll(roll, positions, "adversity"))
              }
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
              onFinish={(positions) =>
                dispatch(reroll(roll, positions, "2heavens"))
              }
              basePool={basePool}
              rerollTypes={rerollTypes}
            />
          );
        }

        if (shouldShow("ruthless")) {
          return (
            <AbilityReroll
              name={"ruthless"}
              text={`Manual reroll: Select the dice you have to reroll.`}
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
              onFinish={(positions) =>
                dispatch(reroll(roll, positions, "sailor"))
              }
              basePool={basePool}
              rerollTypes={rerollTypes}
              compromised={compromised}
            />
          );
        }

        if (shouldShow("ruleless")) {
          return (
            <AbilityReroll
              name={"ruleless"}
              text={`Manual reroll: Select the dice you want/have to reroll.`}
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
              text={`Manual alteration: Change the result as you want/have to.`}
            />
          );
        }

        const addReroll = () => dispatch(addModifiers(roll, ["ruleless"]));

        return (
          <Confirm
            dices={dices}
            onFinish={() => dispatch(goToKeepStep())}
            basePool={basePool}
            rerollTypes={rerollTypes}
            addReroll={!modifiers.includes("ruleless") && addReroll}
          />
        );
      }

      return (
        <RerollResult
          dices={dices}
          basePool={basePool}
          rerollTypes={metadata?.rerolls || []}
        />
      );
    }

    return null;
  };

  return (
    <Layout>
      <Collapse activeKey={activeKeys} onChange={setActiveKeys}>
        <Panel
          header="Declare"
          key="declare"
          collapsible={currentStep === DECLARE ? "disabled" : "header"}
        >
          {currentStep === DECLARE ? (
            <Intent
              onFinish={(data) => dispatch(create({ ...roll, ...data }, user))}
              values={roll}
            />
          ) : (
            <Summary {...intent} />
          )}
        </Panel>
        <Panel
          header="Modify"
          key="modify"
          collapsible={
            disabled(REROLL) || currentStep === REROLL ? "disabled" : "header"
          }
        >
          <PanelContent name={REROLL} />
        </Panel>
        <Panel
          header="Keep"
          key="keep"
          collapsible={
            disabled(KEEP) || currentStep === KEEP ? "disabled" : "header"
          }
        >
          <PanelContent name={KEEP} />
        </Panel>
        <Panel
          header="Resolve"
          key="resolve"
          collapsible={
            disabled(RESOLVE) || currentStep === RESOLVE ? "disabled" : "header"
          }
        >
          <PanelContent name={RESOLVE} />
        </Panel>
      </Collapse>
    </Layout>
  );
};

export default Roller;
