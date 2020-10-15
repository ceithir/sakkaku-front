import React from "react";
import Intent from "./Intent";
import { useSelector, useDispatch } from "react-redux";
import { selectAll, create, softReset, keep, reroll } from "./reducer";
import Keep from "./Keep";
import KeepExplosions from "./KeepExplosions";
import Distinction from "./Distinction";
import Adversity from "./Adversity";
import Summary from "./Summary";
import Complete from "./Complete";
import { Alert, Typography } from "antd";
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

const { Paragraph, Link } = Typography;

const Roller = ({ user, save }) => {
  const roll = useSelector(selectAll);
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

  const { dices, tn, metadata, modifiers, ring, error } = roll;

  const dicesRolled = dices.length > 0;
  const atLeastOneUnresolvedDice =
    dicesRolled && dices.some((dice) => dice.status === "pending");
  const keptDices = dices.filter((dice) => dice.status === "kept");
  const atLeastOneKeptDice = keptDices.length > 0;
  const rerollDone =
    metadata?.rerolls?.length ||
    !(modifiers.includes("adversity") || modifiers.includes("distinction"));
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
          user={user}
        />
      )}
      {dicesRolled && (
        <>
          <Summary {...roll} />
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
                    />
                  )}
                  {atLeastOneKeptDice && (
                    <KeepExplosions
                      dices={dices}
                      onFinish={(data) => dispatch(keep(roll, data))}
                      compromised={compromised}
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
