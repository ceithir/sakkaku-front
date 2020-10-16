import React from "react";
import Intent from "./Intent";
import { useSelector, useDispatch } from "react-redux";
import { selectAll, create, softReset, keep, reroll } from "./reducer";
import Keep from "./Keep";
import KeepExplosions from "./KeepExplosions";
import Distinction from "./reroll/Distinction";
import Adversity from "./reroll/Adversity";
import Summary from "./Summary";
import Complete from "./Complete";
import { Alert, Typography, Steps, Collapse } from "antd";
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

const { Paragraph, Link } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;

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

  const { dices, tn, metadata, modifiers, ring, error, id, description } = roll;

  const dicesRolled = dices.length > 0;
  const atLeastOneUnresolvedDice =
    dicesRolled && dices.some((dice) => dice.status === "pending");
  const keptDices = dices.filter((dice) => dice.status === "kept");
  const atLeastOneKeptDice = keptDices.length > 0;
  const hasReroll =
    modifiers.includes("adversity") || modifiers.includes("distinction");
  const rerollDone = metadata?.rerolls?.length || !hasReroll;
  const compromised = modifiers.includes("compromised");
  const trulyCompromised =
    compromised &&
    dicesRolled &&
    rerollDone &&
    !atLeastOneKeptDice &&
    dices
      .filter((dice) => dice.status === "pending")
      .every((dice) => dice.value.strife);
  const voided = modifiers.includes("void");

  if (error) {
    return <DefaultErrorMessage />;
  }

  const currentStep = () => {
    if (dicesRolled && rerollDone && !atLeastOneUnresolvedDice) {
      return 3;
    }

    if (dicesRolled && rerollDone) {
      return 2;
    }

    if (dicesRolled && hasReroll) {
      return 1;
    }

    return 0;
  };

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
      {!dicesRolled && (
        <Intent
          onFinish={(data) => dispatch(create({ ...roll, ...data }, user))}
          values={roll}
        />
      )}
      {dicesRolled && (
        <>
          <Steps current={currentStep()} className={styles.steps}>
            <Step title={"Declare"} description={"Declare Intention"} />
            <Step title={"Reroll"} description={"Modify Rolled Dice"} />
            <Step title={"Keep"} description={"Choose Kept Dice"} />
            <Step title={"Resolve"} description={"Resolve Symbols"} />
          </Steps>
          <Collapse>
            <Panel header="Declared Intention">
              <Summary {...roll} />
            </Panel>
          </Collapse>
          {!rerollDone && (
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
          {rerollDone && (
            <>
              {atLeastOneUnresolvedDice ? (
                <>
                  {!atLeastOneKeptDice && (
                    <Keep
                      dices={dices}
                      max={voided ? ring + 1 : ring}
                      onFinish={(data) => dispatch(keep(roll, data))}
                      compromised={compromised}
                      trulyCompromised={trulyCompromised}
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
              ) : (
                <Complete
                  dices={dices}
                  tn={tn}
                  footer={
                    <NextButton onClick={() => dispatch(softReset())}>
                      New roll
                    </NextButton>
                  }
                  id={id}
                  description={description}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Roller;
