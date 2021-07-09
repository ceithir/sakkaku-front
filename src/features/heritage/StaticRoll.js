import React from "react";
import Summary from "./Summary";
import Layout from "./Layout";
import SummaryList from "./SummaryList";

const StaticRoll = ({ roll, context }) => {
  const { dices, metadata } = roll;

  if (!dices.length) {
    return null;
  }

  const { table } = metadata;

  if (dices.some(({ status }) => status === "pending")) {
    return (
      <Layout dices={dices} context={context}>
        <p>{`Player has yet to choose between the following options.`}</p>
        <SummaryList
          table={table}
          list={dices
            .filter(({ status }) => status === "pending")
            .map(({ value }) => {
              return { rolls: [value] };
            })}
        />
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
    </Layout>
  );
};

export default StaticRoll;
