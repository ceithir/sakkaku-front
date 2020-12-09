import React from "react";
import { Radio } from "antd";
import Dice from "./Dice";
import styles from "./DiceSideSelector.module.css";

const SEPARATOR = "-";

const toString = ({
  type,
  value: { opportunity, strife, success, explosion },
}) => {
  return [
    type,
    ...[opportunity, strife, success, explosion].map((number) =>
      (number || 0).toString()
    ),
  ].join(SEPARATOR);
};

const toObject = (string) => {
  const [type, ...value] = string.split(SEPARATOR);
  const [opportunity, strife, success, explosion] = value.map((s) =>
    parseInt(s)
  );
  return {
    type,
    value: {
      opportunity,
      strife,
      success,
      explosion,
    },
  };
};

const DiceSideSelector = ({ type, value, onChange }) => {
  const ring = [
    { opportunity: 1, strife: 1 },
    { opportunity: 1 },
    { success: 1, strife: 1 },
    { success: 1 },
    { explosion: 1, strife: 1 },
  ];

  const skill = [
    { opportunity: 1 },
    { success: 1, strife: 1 },
    { success: 1 },
    { explosion: 1, strife: 1 },
    { success: 1, opportunity: 1 },
    { explosion: 1 },
  ];

  const facets = type === "skill" ? skill : ring;

  return (
    <Radio.Group
      onChange={({ target: { value } }) => onChange(toObject(value))}
      className={styles.group}
      value={toString({ type, value })}
    >
      {facets.map((value) => {
        const key = toString({ type, value });
        return (
          <Radio.Button key={key} value={key}>
            <Dice dice={{ type, value }} />
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );
};

export default DiceSideSelector;
