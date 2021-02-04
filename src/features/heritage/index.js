import React from "react";
import { Button, Card, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  selectLoading,
  selectError,
  selectRoll,
  create,
  keep,
  reset,
} from "./reducer";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import styles from "./index.module.css";

const { Text } = Typography;

const Heritage = () => {
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch();
  const roll = useSelector(selectRoll);
  const { dices } = roll;

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!dices.length) {
    return (
      <Button
        type="primary"
        onClick={() => {
          dispatch(create());
        }}
        disabled={loading}
      >
        {`Roll`}
      </Button>
    );
  }

  return (
    <>
      <Card className={styles["raw-results"]}>
        <Text>{`Dices:`}</Text>
        {dices.map(({ value, status }, index) => {
          return (
            <Text
              disabled={status === "dropped"}
              strong={status === "kept"}
              key={index.toString()}
            >
              {value}
            </Text>
          );
        })}
      </Card>
      {dices.some(({ status }) => status === "pending") ? (
        <>
          {dices
            .filter(({ status }) => status === "pending")
            .map(({ value }, index) => {
              return (
                <Button
                  key={index.toString()}
                  onClick={() => dispatch(keep(roll, index))}
                >{`Keep ${value}`}</Button>
              );
            })}
        </>
      ) : (
        <>
          <Button
            onClick={() => {
              dispatch(reset());
            }}
          >{`Reroll`}</Button>
        </>
      )}
    </>
  );
};

export default Heritage;
