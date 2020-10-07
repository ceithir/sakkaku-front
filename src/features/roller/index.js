import React from "react";
import styles from "./index.module.css";
import Intent from "./Intent";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAll,
  create,
  softReset,
  keep,
  explodeDie,
  keepTemporary,
  discardTemporary,
} from "./reducer";
import { Button } from "antd";
import Keep from "./Keep";
import Kept from "./Kept";
import Result from "./Result";
import Explode from "./Explode";

const Roller = () => {
  const roll = useSelector(selectAll);
  const dispatch = useDispatch();

  const { dices, tn, temporaryDices } = roll;

  const dicesRolled = dices.length > 0;
  const keptDices = dices.filter((dice) => dice.status === "kept");
  const atLeastOneKeptDice = keptDices.length > 0;
  const atLeastOneExplosion =
    atLeastOneKeptDice && keptDices.filter((dice) => dice.explosion).length > 0;
  const atLeastOneUnresolvedExplosion =
    atLeastOneExplosion &&
    keptDices.filter((dice) => dice.explosion && !dice.exploded).length > 0;
  const completed =
    atLeastOneKeptDice &&
    !atLeastOneUnresolvedExplosion &&
    !temporaryDices?.length;

  return (
    <div className={styles.layout}>
      <Intent
        completed={dicesRolled}
        onFinish={(data) => dispatch(create({ ...roll, ...data }))}
        values={roll}
      />
      {dicesRolled && !atLeastOneKeptDice && (
        <Keep dices={dices} onFinish={(data) => dispatch(keep(roll, data))} />
      )}
      {atLeastOneKeptDice && (
        <>
          <Kept dices={dices} />
          {atLeastOneExplosion && !completed && (
            <Explode
              dices={dices}
              temporary={temporaryDices}
              roll={(data) => dispatch(explodeDie(roll, data))}
              keep={(data) => dispatch(keepTemporary(roll, data))}
              discard={(data) => dispatch(discardTemporary(roll, data))}
            />
          )}
        </>
      )}
      {completed && (
        <>
          <Result dices={keptDices} tn={tn} />
          <Button onClick={() => dispatch(softReset())}>Reroll</Button>
        </>
      )}
    </div>
  );
};

export default Roller;
