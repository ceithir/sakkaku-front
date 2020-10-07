import React from "react";
import styles from "./index.module.css";
import Intent from "./Intent";
import { useSelector, useDispatch } from "react-redux";
import { selectAll, create, softReset, keep } from "./reducer";
import { Button } from "antd";
import Keep from "./Keep";
import Kept from "./Kept";
import Result from "./Result";

const Roller = () => {
  const roll = useSelector(selectAll);
  const dispatch = useDispatch();

  const { rolledDices, keptDices, keepSelection, tn } = roll;
  const completed = keptDices?.length;

  return (
    <div className={styles.layout}>
      <Intent
        completed={rolledDices?.length}
        onFinish={(data) => dispatch(create({ ...roll, ...data }))}
        values={roll}
      />
      {rolledDices && !keptDices && (
        <Keep
          dices={rolledDices}
          onFinish={(data) => dispatch(keep(roll, data))}
        />
      )}
      {keptDices && (
        <>
          <Kept dices={rolledDices} selection={keepSelection} />
          <Result dices={keptDices} tn={tn} />
        </>
      )}
      {completed && (
        <Button onClick={() => dispatch(softReset())}>Reroll</Button>
      )}
    </div>
  );
};

export default Roller;
