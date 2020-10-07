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
import KeptExplosions from "./KeptExplosions";

const Roller = () => {
  const roll = useSelector(selectAll);
  const dispatch = useDispatch();

  const {
    rolledDices,
    keptDices,
    keepSelection,
    tn,
    unresolvedExplosions,
    temporaryDices,
    ring,
  } = roll;
  const completed =
    keptDices?.length &&
    !unresolvedExplosions?.length &&
    !temporaryDices?.length;

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
          {!completed && (
            <Explode
              unresolved={unresolvedExplosions}
              temporary={temporaryDices}
              roll={(data) => dispatch(explodeDie(roll, data))}
              keep={(data) => dispatch(keepTemporary(roll, data))}
              discard={(data) => dispatch(discardTemporary(roll, data))}
            />
          )}
          <KeptExplosions keptDices={keptDices} ring={ring} />
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
