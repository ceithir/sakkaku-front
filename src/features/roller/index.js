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
} from "./reducer";
import Keep from "./Keep";
import Distinction from "./reroll/Distinction";
import Adversity from "./reroll/Adversity";
import Ability from "./reroll/Ability";
import Ishiken from "./reroll/Ishiken";
import Summary from "./Summary";
import { Collapse } from "antd";
import styles from "./index.module.css";
import {
  setId,
  setParameters,
  setDices,
  setMetadata,
  setPlayer,
} from "./reducer";
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
    dispatch(setId(save.id));
    dispatch(setParameters({ ...save, ...save.roll.parameters }));
    dispatch(setDices(save.roll.dices));
    dispatch(setMetadata(save.roll.metadata));
    dispatch(setPlayer(save.user));
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
  } = roll;

  const compromised = modifiers.includes("compromised");
  const voided = modifiers.includes("void");
  const basePool = ring + skill + (voided ? 1 : 0);
  const rerollTypes = metadata?.rerolls || [];

  if (error) {
    return <DefaultErrorMessage />;
  }

  const disabled = (panel) => {
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
            onFinish={(data) => dispatch(keep(roll, data))}
            compromised={compromised}
            tn={tn}
            ring={ring}
            skill={skill}
            voided={voided}
            rerollTypes={rerollTypes}
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

        if (shouldShow("shadow")) {
          return (
            <AbilityReroll
              name={"shadow"}
              text={`Thanks to your School Ability, you can stake honor up to your school rank to re-roll a number of dice equal to twice the amount of honor staked.`}
            />
          );
        }

        if (shouldShow("deathdealer")) {
          return (
            <AbilityReroll
              name={"deathdealer"}
              text={`Thanks to your School Ability, you can may reroll dice up to your school rank.`}
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

        return null;
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
        <Panel header="Declare" key="declare">
          {currentStep === DECLARE ? (
            <Intent
              onFinish={(data) => dispatch(create({ ...roll, ...data }, user))}
              values={roll}
            />
          ) : (
            <Summary {...intent} />
          )}
        </Panel>
        <Panel header="Modify" key="modify" disabled={disabled(REROLL)}>
          <PanelContent name={REROLL} />
        </Panel>
        <Panel header="Keep" key="keep" disabled={disabled(KEEP)}>
          <PanelContent name={KEEP} />
        </Panel>
        <Panel header="Resolve" key="resolve" disabled={disabled(RESOLVE)}>
          <PanelContent name={RESOLVE} />
        </Panel>
      </Collapse>
    </Layout>
  );
};

export default Roller;
