import React from "react";
import ImageDie from "./ImageDie";
import styles from "./Result.module.less";
import { Typography } from "antd";

const { Text } = Typography;

export const isAForceRoll = ({
  ability,
  boost,
  challenge,
  difficulty,
  proficiency,
  setback,
  force,
}) => {
  return (
    force > 0 &&
    ability === 0 &&
    boost === 0 &&
    challenge === 0 &&
    difficulty === 0 &&
    proficiency === 0 &&
    setback === 0
  );
};

const Additions = ({
  parameters,
  result: {
    success,
    failure,
    triumph,
    despair,
    advantage,
    threat,
    light,
    dark,
  },
}) => {
  if (isAForceRoll(parameters)) {
    return null;
  }

  const netSuccesses = success + triumph - failure - despair;
  const netAdvantages = advantage - threat;

  const dataSource = [
    {
      label: `Net Successes (including Triumph and Despair)`,
      value: netSuccesses,
      color: netSuccesses > 0 ? "success" : "danger",
    },
    {
      label: `Net Advantages`,
      value: netAdvantages,
      color: netAdvantages >= 0 ? null : "warning",
    },
    {
      label: `Triumph`,
      value: triumph,
    },
    {
      label: `Despair`,
      value: despair,
    },
  ];

  return (
    <div className={styles.additions}>
      {dataSource.map(({ label, value, color }, index) => {
        return (
          <span key={index.toString()}>
            {label}
            {`: `}
            <Text strong={true} type={color}>
              {value}
            </Text>
          </span>
        );
      })}
    </div>
  );
};

const Summary = ({ parameters, result }) => {
  return (
    <div className={styles.summary}>
      <Additions parameters={parameters} result={result} />
      {parameters.force > 0 && (
        <div className={styles.force}>
          <Text>{`Light: ${result.light}`}</Text>
          <Text>{`Dark: ${result.dark}`}</Text>
        </div>
      )}
    </div>
  );
};

const Result = ({ parameters, dice }) => {
  const result = {
    success: 0,
    failure: 0,
    triumph: 0,
    despair: 0,
    advantage: 0,
    threat: 0,
    light: 0,
    dark: 0,
  };
  dice.forEach((die) => {
    Object.keys(result).forEach((key) => {
      result[key] += die["value"][key];
    });
  });

  return (
    <div className={styles.container}>
      <div className={styles.dice}>
        {dice.map((die, index) => {
          return <ImageDie key={index.toString()} {...die} />;
        })}
      </div>
      <Summary parameters={parameters} result={result} />
    </div>
  );
};

export default Result;
