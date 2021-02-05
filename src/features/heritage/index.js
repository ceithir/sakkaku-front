import React from "react";
import { Button, Card, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectError, selectRoll, keep, reset } from "./reducer";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import styles from "./index.module.css";
import Form from "./Form";
import Summary from "./Summary";

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
      <Text>{`You rolled:`}</Text>
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
        <p>{`Choose one of those two options as the relative for whom your character is named.`}</p>
        {dices
          .filter(({ status }) => status === "pending")
          .map(({ value }, index) => {
            return (
              <Summary key={index.toString()} table={table} rolls={[value]}>
                <Button
                  onClick={() => dispatch(keep(roll, index))}
                >{`Keep that result`}</Button>
              </Summary>
            );
          })}
      </CompleteLayout>
    );
  }

  return (
    <CompleteLayout>
      <Summary
        table={table}
        rolls={dices
          .filter(({ status }) => status === "kept")
          .map(({ value }) => value)}
      />
      <div className={styles.footer}>
        <Button
          onClick={() => {
            dispatch(reset());
          }}
          type="dashed"
        >{`Roll another heritage`}</Button>
      </div>
    </CompleteLayout>
  );
};

export default Heritage;
