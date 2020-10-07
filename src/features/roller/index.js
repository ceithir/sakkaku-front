import React from "react";
import styles from "./index.module.css";
import Intent from "./Intent";
import { useSelector, useDispatch } from "react-redux";
import { selectAll, create, softReset, keep } from "./reducer";
import { Button } from "antd";
import Keep from "./Keep";
import KeepExplosions from "./KeepExplosions";
import Kept from "./Kept";
import Result from "./Result";

const Roller = () => {
  const roll = useSelector(selectAll);
  const dispatch = useDispatch();

  const { dices, tn } = roll;

  const dicesRolled = dices.length > 0;
  const atLeastOneUnresolvedDice =
    dicesRolled && dices.some((dice) => dice.status === "pending");
  const keptDices = dices.filter((dice) => dice.status === "kept");
  const atLeastOneKeptDice = keptDices.length > 0;

  const completed = atLeastOneKeptDice && !atLeastOneUnresolvedDice;

  return (
    <div className={styles.layout}>
      <Intent
        completed={dicesRolled}
        onFinish={(data) => dispatch(create({ ...roll, ...data }))}
        values={roll}
      />
      {atLeastOneUnresolvedDice && !atLeastOneKeptDice && (
        <Keep dices={dices} onFinish={(data) => dispatch(keep(roll, data))} />
      )}
      {atLeastOneUnresolvedDice && atLeastOneKeptDice && (
        <KeepExplosions
          dices={dices}
          onFinish={(data) => dispatch(keep(roll, data))}
        />
      )}
      {completed && (
        <>
          <Kept dices={dices} />
          <Result dices={keptDices} tn={tn} />
          <Button onClick={() => dispatch(softReset())}>Reroll</Button>
        </>
      )}
    </div>
  );
};

export default Roller;
