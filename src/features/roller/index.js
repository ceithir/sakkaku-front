import React from "react";
import styles from "./index.module.css";
import Intent from "./Intent";
import { useSelector, useDispatch } from "react-redux";
import { selectAll, create, softReset } from "./reducer";
import { Button } from "antd";
import Dices from "./Dices";

const INTENT = "intent";
const STEPS = [INTENT];

export default () => {
  const roll = useSelector(selectAll);
  const dispatch = useDispatch();

  const { step, unmodifiedRoll } = roll;
  const completed = !STEPS.includes(step);

  return (
    <div className={styles.layout}>
      <Intent
        completed={step !== INTENT}
        onFinish={(data) => dispatch(create({ ...roll, ...data }))}
        values={roll}
      />
      {unmodifiedRoll && <Dices dices={unmodifiedRoll} />}
      {completed && (
        <Button onClick={() => dispatch(softReset())}>Reroll</Button>
      )}
    </div>
  );
};
