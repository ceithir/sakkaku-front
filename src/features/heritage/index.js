import React from "react";
import { Button, Card, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectError, selectRoll, keep, reset } from "./reducer";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import styles from "./index.module.css";
import Form from "./Form";
import Description from "./Description";

const { Text, Title } = Typography;

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Title>{`Heritage Roll`}</Title>
      <>{children}</>
    </div>
  );
};

const Dices = ({ dices }) => {
  return (
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
  );
};

const Heritage = () => {
  const error = useSelector(selectError);
  const dispatch = useDispatch();
  const roll = useSelector(selectRoll);
  const { dices, metadata } = roll;

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!dices.length) {
    return (
      <Layout>
        <Form />
      </Layout>
    );
  }

  const { table } = metadata;

  const CompleteLayout = ({ children }) => {
    return (
      <Layout>
        <Dices dices={dices} />
        {children}
      </Layout>
    );
  };

  if (dices.some(({ status }) => status === "pending")) {
    return (
      <CompleteLayout>
        {dices
          .filter(({ status }) => status === "pending")
          .map(({ value }, index) => {
            return (
              <Card key={index.toString()}>
                <Description firstRoll={value} table={table} />
                <Button
                  onClick={() => dispatch(keep(roll, index))}
                >{`Keep ${value}`}</Button>
              </Card>
            );
          })}
      </CompleteLayout>
    );
  }

  const [firstRoll, secondRoll] = dices
    .filter(({ status }) => status === "kept")
    .map(({ value }) => value);

  return (
    <CompleteLayout>
      <Description
        firstRoll={firstRoll}
        secondRoll={secondRoll}
        table={table}
      />
      <Button
        onClick={() => {
          dispatch(reset());
        }}
      >{`Reroll`}</Button>
    </CompleteLayout>
  );
};

export default Heritage;
