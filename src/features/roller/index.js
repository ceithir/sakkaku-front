import React from "react";
import styles from "./index.module.css";
import Intent from "./Intent";
import { useSelector, useDispatch } from "react-redux";
import { selectAll, create, softReset, keep, reroll } from "./reducer";
import { Button, Card } from "antd";
import Keep from "./Keep";
import KeepExplosions from "./KeepExplosions";
import Kept from "./Kept";
import Result from "./Result";
import Distinction from "./Distinction";
import Adversity from "./Adversity";

const Roller = () => {
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

  return (
    <div className={styles.layout}>
      <Card>
        <Intent
          completed={dicesRolled}
          onFinish={(data) => dispatch(create({ ...roll, ...data }))}
          values={roll}
          loading={loading}
        />
        {dicesRolled && (
          <>
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
                        max={ring}
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
                  <>
                    <Kept dices={dices} trulyCompromised={trulyCompromised} />
                    <Result dices={keptDices} tn={tn} />
                    <Button
                      type="primary"
                      onClick={() => dispatch(softReset())}
                    >
                      Reroll
                    </Button>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Roller;
