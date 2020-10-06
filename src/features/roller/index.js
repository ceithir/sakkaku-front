import React from "react";
import styles from "./index.module.css";
import Intent from "./Intent";
import { useSelector, useDispatch } from "react-redux";
import { selectStep, selectAll, update } from "./reducer";

const INTENT = "intent";

export default () => {
  const step = useSelector(selectStep);
  const roll = useSelector(selectAll);
  const dispatch = useDispatch();
  const onFinish = (data) => dispatch(update({ ...roll, ...data }));

  return (
    <div className={styles.layout}>
      <Intent completed={step !== INTENT} onFinish={onFinish} values={roll} />
    </div>
  );
};
