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

  const { dices, tn, rerolled, modifier, ring, compromised } = roll;

  const dicesRolled = dices.length > 0;
  const atLeastOneUnresolvedDice =
    dicesRolled && dices.some((dice) => dice.status === "pending");
  const keptDices = dices.filter((dice) => dice.status === "kept");
  const atLeastOneKeptDice = keptDices.length > 0;
  const rerollDone = rerolled || modifier === "none";
  const trulyCompromised =
    compromised &&
    dicesRolled &&
    rerollDone &&
    !atLeastOneKeptDice &&
    dices
      .filter((dice) => dice.status === "pending")
      .every((dice) => dice.value.strife);
  const completed =
    (atLeastOneKeptDice && !atLeastOneUnresolvedDice) || trulyCompromised;

  return (
    <div className={styles.layout}>
      <Card>
        <Intent
          completed={dicesRolled}
          onFinish={(data) => dispatch(create({ ...roll, ...data }))}
          values={roll}
        />
        {dicesRolled && (
          <>
            {!rerollDone && (
              <>
                {modifier === "distinction" && (
                  <Distinction
                    dices={dices}
                    onFinish={(data) => dispatch(reroll(roll, data))}
                  />
                )}
                {modifier === "adversity" && (
                  <Adversity
                    dices={dices}
                    onFinish={(data) => dispatch(reroll(roll, data))}
                  />
                )}
              </>
            )}
            {rerollDone && (
              <>
                {!trulyCompromised && atLeastOneUnresolvedDice && (
                  <>
                    {!atLeastOneKeptDice && (
                      <Keep
                        dices={dices}
                        max={ring}
                        onFinish={(data) => dispatch(keep(roll, data))}
                        compromised={compromised}
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
                )}
                {completed && (
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
