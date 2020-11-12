import React from "react";
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
import Resolve from "./result/Resolve";

const { Paragraph, Link } = Typography;
const { Panel } = Collapse;

const Layout = ({ anonymous, currentStep, children }) => {
  const intent = useSelector(selectIntent);

  return (
    <>
      {anonymous && (
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
      {currentStep !== DECLARE && (
        <Collapse>
          <Panel header="Declared Intention">
            <Summary {...intent} />
          </Panel>
        </Collapse>
      )}
      <>{children}</>
    </>
  );
};

const Roller = ({ save }) => {
  const roll = useSelector(selectAll);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!save || !dispatch) {
      return;
    }
    dispatch(setId(save.id));
    dispatch(setParameters({ ...save, ...save.roll.parameters }));
    dispatch(setDices(save.roll.dices));
    dispatch(setMetadata(save.roll.metadata));
    dispatch(setPlayer(save.user));
  }, [save, dispatch]);
  const currentStep = useSelector(selectStep);

  const { dices, tn, modifiers, ring, error, id, description } = roll;

  const atLeastOneKeptDice =
    dices.filter((dice) => dice.status === "kept").length > 0;
  const compromised = modifiers.includes("compromised");
  const voided = modifiers.includes("void");

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <Layout anonymous={!user} currentStep={currentStep}>
      {currentStep === DECLARE && (
        <Intent
          onFinish={(data) => dispatch(create({ ...roll, ...data }, user))}
          values={roll}
        />
      )}
      {currentStep === REROLL && (
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
      )}
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
      {currentStep === RESOLVE && (
        <Resolve
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
      )}
    </Layout>
  );
};

export default Roller;
