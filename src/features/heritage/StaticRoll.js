import React from "react";
import Summary from "./Summary";
import Layout from "./Layout";

const StaticRoll = ({ roll, context }) => {
  const { dices, metadata } = roll;

  if (!dices.length) {
    return null;
  }

  const { table } = metadata;

  if (dices.some(({ status }) => status === "pending")) {
    return (
      <Layout dices={dices}>
        <p>{`Player has yet to choose between the following options.`}</p>
        {dices
          .filter(({ status }) => status === "pending")
          .map(({ value }, index) => {
            return (
              <Summary key={index.toString()} table={table} rolls={[value]} />
            );
          })}
      </Layout>
    );
  }

  return (
    <Layout dices={dices}>
      <Summary
        table={table}
        rolls={dices
          .filter(({ status }) => status === "kept")
          .map(({ value }) => value)}
        context={context}
      />
    </Layout>
  );
};

export default StaticRoll;
