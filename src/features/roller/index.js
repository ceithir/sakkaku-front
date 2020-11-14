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
} from "./reducer";
import Keep from "./Keep";
import Distinction from "./reroll/Distinction";
import Adversity from "./reroll/Adversity";
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

  const { dices, tn, modifiers, ring, skill, error, id, description } = roll;

  const compromised = modifiers.includes("compromised");
  const voided = modifiers.includes("void");
  const basePool = ring + skill + (voided ? 1 : 0);
  const rerollType =
    (modifiers.includes("distinction") && "distinction") ||
    (modifiers.includes("adversity") && "adversity");

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
      return !rerollType || currentStep === DECLARE;
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
          />
        );
      }
      return <KeepResult dices={dices} basePool={basePool} />;
    }

    if (name === REROLL) {
      if (currentStep === REROLL) {
        return (
          <>
            {modifiers.includes("distinction") && (
              <Distinction
                dices={dices}
                onFinish={(positions) =>
                  dispatch(reroll(roll, positions, "distinction"))
                }
              />
            )}
            {modifiers.includes("adversity") && (
              <Adversity
                dices={dices}
                onFinish={(positions) =>
                  dispatch(reroll(roll, positions, "adversity"))
                }
              />
            )}
          </>
        );
      }
      return (
        <RerollResult
          dices={dices}
          basePool={basePool}
          rerollType={rerollType}
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
