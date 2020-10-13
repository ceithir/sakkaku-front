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
import Layout from "./Layout";

const Roller = ({ user }) => {
  const roll = useSelector(selectAll);
  const dispatch = useDispatch();

  const { dices, tn, metadata, modifiers, ring, loading } = roll;

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

  return (
    <Layout>
      {!dicesRolled && (
        <Intent
          onFinish={(data) => dispatch(create({ ...roll, ...data }, user))}
          values={roll}
          loading={loading}
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
                  loading={loading}
                />
              )}
              {modifiers.includes("adversity") && (
                <Adversity
                  dices={dices}
                  onFinish={(positions) =>
                    dispatch(reroll(roll, positions, "adversity"))
                  }
                  loading={loading}
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
                      loading={loading}
                    />
                  )}
                  {atLeastOneKeptDice && (
                    <KeepExplosions
                      dices={dices}
                      onFinish={(data) => dispatch(keep(roll, data))}
                      compromised={compromised}
                      loading={loading}
                    />
                  )}
                </>
              ) : (
                <Complete
                  dices={dices}
                  tn={tn}
                  onClick={() => dispatch(softReset())}
                />
              )}
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default Roller;
