import React from "react";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectError, selectRoll, keep, reset, selectContext } from "./reducer";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import styles from "./Roll.module.less";
import Form from "./Form";
import Summary from "./Summary";
import { selectUser } from "../user/reducer";
import Layout from "./Layout";
import SummaryList from "./SummaryList";
import AnonymousAlert from "../../AnonymousAlert";
import CopyLink from "../trinket/CopyLink";
import { useHistory } from "react-router-dom";

const CustomLayout = ({ children, ...props }) => {
  const user = useSelector(selectUser);

  return (
    <>
      {!user && <AnonymousAlert />}
      <Layout {...props}>{children}</Layout>
    </>
  );
};

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
      <CustomLayout>
        <Form />
      </CustomLayout>
    );
  }

  const { table } = metadata;

  if (dices.some(({ status }) => status === "pending")) {
    return (
      <CustomLayout
        dices={dices}
        context={context}
        instruction={`Choose one of those two options as the relative for whom your character is named.`}
      >
        <SummaryList
          list={dices
            .filter(({ status }) => status === "pending")
            .map(({ value }, index) => {
              return {
                rolls: [value],
                footer: (
                  <div className={styles.footer}>
                    <Button
                      onClick={() =>
                        dispatch(keep({ roll, position: index, user }))
                      }
                    >{`Keep that result`}</Button>
                  </div>
                ),
              };
            })}
          table={table}
        ></SummaryList>
      </CustomLayout>
    );
  }

  return (
    <CustomLayout dices={dices} context={context}>
      <div>
        <Summary
          table={table}
          rolls={dices
            .filter(({ status }) => status === "kept")
            .map(({ value }) => value)}
        />
        <div className={styles.footer}>
          <CopyLink disabled={!roll.uuid} />
          {roll.uuid && (
            <Button
              onClick={() => {
                dispatch(reset());
                history.push("/rolls");
              }}
            >{`Go back`}</Button>
          )}
          <Button
            onClick={() => {
              dispatch(reset());
            }}
            type="dashed"
          >{`Roll another heritage`}</Button>
        </div>
      </div>
    </CustomLayout>
  );
};

export default Roll;
