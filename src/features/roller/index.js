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
import KeepExplosions from "./KeepExplosions";
import Distinction from "./reroll/Distinction";
import Adversity from "./reroll/Adversity";
import Summary from "./Summary";
import { Alert, Typography, Collapse } from "antd";
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
import Complete from "./Complete";

const { Paragraph, Link } = Typography;
const { Panel } = Collapse;

const Layout = ({ children }) => {
  const user = useSelector(selectUser);
  const currentStep = useSelector(selectStep);

  return (
    <>
      {!user && (
        <Alert
          className={`boxed ${styles.alert}`}
          message={
            <>
              <Paragraph>You are not logged in.</Paragraph>
              <Paragraph>
                Rolls made as guest are not saved in the database and cannot be
                linked to.
              </Paragraph>
              <Paragraph>
                Please <Link href="/login">log in</Link> first if you wish to
                post your results elsewhere.
              </Paragraph>
            </>
          }
          type="warning"
        />
      )}
      <Steps current={currentStep} />
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

  const [activeKeys, setActiveKeys] = useState([]);
  useEffect(() => {
    // FIXME: Naming inconsistency
    if (currentStep === REROLL) {
      setActiveKeys(["modify"]);
      return;
    }
    setActiveKeys([currentStep]);
  }, [currentStep]);

  const { dices, tn, modifiers, ring, skill, error } = roll;

  const atLeastOneKeptDice =
    dices.filter((dice) => dice.status === "kept").length > 0;
  const compromised = modifiers.includes("compromised");
  const voided = modifiers.includes("void");
  const basePool = ring + skill + (voided ? 1 : 0);
  const rerollType =
    (modifiers.includes("distinction") && "distinction") ||
    (modifiers.includes("adversity") && "adversity");

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (currentStep === RESOLVE) {
    return (
      <Layout>
        <Complete
          dices={dices}
          button={
            <NextButton onClick={() => dispatch(softReset())}>
              New roll
            </NextButton>
          }
          intent={intent}
          context={intent}
          player={intent.player}
          activeKey={activeKeys}
          onChange={setActiveKeys}
        />
      </Layout>
    );
  }

  if (currentStep === KEEP) {
    return (
      <Layout>
        <Collapse activeKey={activeKeys} onChange={setActiveKeys}>
          <Panel header="Declare" key="declare">
            <Summary {...intent} />
          </Panel>
          <Panel header="Modify" key="modify" disabled={!rerollType}>
            {rerollType && (
              <RerollResult
                dices={dices}
                basePool={basePool}
                rerollType={rerollType}
              />
            )}
          </Panel>
          <Panel header="Keep" key="keep">
            {currentStep === KEEP && (
              <>
                {!atLeastOneKeptDice && (
                  <Keep
                    dices={dices}
                    max={voided ? ring + 1 : ring}
                    onFinish={(data) => dispatch(keep(roll, data))}
                    compromised={compromised}
                    tn={tn}
                  />
                )}
                {atLeastOneKeptDice && (
                  <KeepExplosions
                    dices={dices}
                    onFinish={(data) => dispatch(keep(roll, data))}
                    compromised={compromised}
                    tn={tn}
                  />
                )}
              </>
            )}
          </Panel>
          <Panel header="Resolve" key="resolve" disabled />
        </Collapse>
      </Layout>
    );
  }

  if (currentStep === REROLL) {
    return (
      <Layout>
        <Collapse activeKey={activeKeys} onChange={setActiveKeys}>
          <Panel header="Declare" key="declare">
            <Summary {...intent} />
          </Panel>
          <Panel header="Modify" key="modify">
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
          </Panel>
          <Panel header="Keep" key="keep" disabled />
          <Panel header="Resolve" key="resolve" disabled />
        </Collapse>
      </Layout>
    );
  }

  return (
    <Layout>
      <Collapse defaultActiveKey={DECLARE}>
        <Panel header="Declare" key="declare">
          <Intent
            onFinish={(data) => dispatch(create({ ...roll, ...data }, user))}
            values={roll}
          />
        </Panel>
        <Panel header="Modify" key="modify" disabled />
        <Panel header="Keep" key="keep" disabled />
        <Panel header="Resolve" key="resolve" disabled />
      </Collapse>
    </Layout>
  );
};

export default Roller;
