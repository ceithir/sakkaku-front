import React from "react";
import Summary from "./Summary";
import Layout from "./Layout";
import SummaryList from "./SummaryList";
import styles from "./StaticRoll.module.less";
import GoBackButton from "../browse/GoBackButton";
import CopyLink from "../trinket/CopyLink";

const StaticRoll = ({ roll, context }) => {
  const { dices, metadata } = roll;

  if (!dices.length) {
    return null;
  }

  const { table } = metadata;

  const CustomLayout = ({ children, ...props }) => {
    return (
      <Layout dices={dices} context={{ ...context, metadata }} {...props}>
        {children}
        <div className={styles["go-back-container"]}>
          <CopyLink />
          <GoBackButton />
        </div>
      </Layout>
    );
  };

  if (dices.some(({ status }) => status === "pending")) {
    return (
      <CustomLayout
        instruction={`Player has yet to choose between the following options.`}
      >
        <SummaryList
          table={table}
          list={dices
            .filter(({ status }) => status === "pending")
            .map(({ value }) => {
              return { rolls: [value] };
            })}
        />
      </CustomLayout>
    );
  }

  return (
    <CustomLayout>
      <Summary
        table={table}
        rolls={dices
          .filter(({ status }) => status === "kept")
          .map(({ value }) => value)}
      />
    </CustomLayout>
  );
};

export default StaticRoll;
