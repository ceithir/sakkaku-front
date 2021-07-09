import React from "react";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectError, selectRoll, keep, reset, selectContext } from "./reducer";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import styles from "./Roll.module.css";
import Form from "./Form";
import Summary from "./Summary";
import { selectUser } from "../user/reducer";
import Layout from "./Layout";
import { useHistory } from "react-router-dom";
import SummaryList from "./SummaryList";

const Roll = () => {
  const error = useSelector(selectError);
  const dispatch = useDispatch();
  const roll = useSelector(selectRoll);
  const context = useSelector(selectContext);
  const user = useSelector(selectUser);
  const history = useHistory();

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

  if (dices.some(({ status }) => status === "pending")) {
    return (
      <Layout dices={dices} context={context}>
        <p>{`Choose one of those two options as the relative for whom your character is named.`}</p>
        <SummaryList>
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
        </SummaryList>
      </Layout>
    );
  }

  return (
    <Layout dices={dices} context={context}>
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
        {user && (
          <Button
            onClick={() => {
              dispatch(reset());
              history.push("/heritage/list");
            }}
            type="dashed"
          >{`See all`}</Button>
        )}
      </div>
    </Layout>
  );
};

export default Roll;
