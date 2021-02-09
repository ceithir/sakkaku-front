import React, { useEffect, useState } from "react";
import Intent from "./Intent";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAll,
  create,
  softReset,
  keep,
  selectStep,
  selectIntent,
  setAddKept,
} from "./reducer";
import Keep from "./Keep";
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
import AnonymousAlert from "../../AnonymousAlert";
import { isReroll, rolledDicesCount } from "./utils";
import Modifier from "./Modifier";

const { Panel } = Collapse;

const Layout = ({ children }) => {
  const user = useSelector(selectUser);
  const currentStep = useSelector(selectStep);

  return (
    <>
      {!user && <AnonymousAlert />}
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

  const basePool = rolledDicesCount(roll);
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

      return !modifiers.some(isReroll);
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
      if (currentStep === REROLL) {
        return <Modifier roll={roll} dispatch={dispatch} />;
      }

      return (
        <RerollResult
          dices={dices}
          basePool={basePool}
          rerollTypes={rerollTypes}
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
