import React from "react";
import { Button, Card, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  selectError,
  selectRoll,
  keep,
  reset,
  selectPreviousRolls,
  selectContext,
  load,
} from "./reducer";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import styles from "./index.module.css";
import Form from "./Form";
import Summary from "./Summary";
import List from "./List";
import { selectUser } from "../user/reducer";

const { Text, Title } = Typography;

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Title>{`Heritage Roll`}</Title>
      <>{children}</>
    </div>
  );
};

const LayoutWithPreviousRolls = ({ children }) => {
  const previousRolls = useSelector(selectPreviousRolls);
  const dispatch = useDispatch();

  return (
    <Layout>
      <>{children}</>
      {previousRolls.length > 0 && (
        <>
          <Title level={2}>{`Previous heritage`}</Title>
          <List
            rolls={previousRolls}
            onClick={(data) => dispatch(load(data))}
          />
        </>
      )}
    </Layout>
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
  const context = useSelector(selectContext);
  const user = useSelector(selectUser);

  const { dices, metadata } = roll;

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!dices.length) {
    return (
      <LayoutWithPreviousRolls>
        <Form />
      </LayoutWithPreviousRolls>
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
                <div className={styles.footer}>
                  <Button
                    onClick={() =>
                      dispatch(keep({ roll, position: index, user }))
                    }
                  >{`Keep that result`}</Button>
                </div>
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
        context={context}
      />
      <div className={styles.footer}>
        <Button
          onClick={() => {
            dispatch(reset());
          }}
          type="dashed"
        >{`Roll another heritage / See list`}</Button>
      </div>
    </CompleteLayout>
  );
};

export default Heritage;
