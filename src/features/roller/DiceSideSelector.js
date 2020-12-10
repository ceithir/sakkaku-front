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

const FACETS = [
  { type: "ring", value: {} },
  { type: "ring", value: { opportunity: 1, strife: 1 } },
  { type: "ring", value: { opportunity: 1 } },
  { type: "ring", value: { success: 1 } },
  { type: "ring", value: { success: 1, strife: 1 } },
  { type: "ring", value: { explosion: 1, strife: 1 } },
  { type: "skill", value: {} },
  { type: "skill", value: { opportunity: 1 } },
  { type: "skill", value: { success: 1, strife: 1 } },
  { type: "skill", value: { success: 1 } },
  { type: "skill", value: { explosion: 1, strife: 1 } },
  { type: "skill", value: { success: 1, opportunity: 1 } },
  { type: "skill", value: { explosion: 1 } },
];

const Loop = ({ facets }) => {
  return (
    <>
      {facets.map(({ type, value }) => {
        const key = toString({ type, value });
        return (
          <Radio.Button key={key} value={key}>
            <Dice dice={{ type, value }} />
          </Radio.Button>
        );
      })}
    </>
  );
};

const DiceSideSelector = ({ value, onChange, facets = FACETS }) => {
  return (
    <Radio.Group
      onChange={({ target: { value } }) => onChange(toObject(value))}
      className={styles.group}
      value={toString(value)}
    >
      <Loop facets={facets} />
    </Radio.Group>
  );
};

export const UncontrolledDiceSideSelector = ({
  initialValue,
  onChange,
  facets = FACETS,
}) => {
  return (
    <Radio.Group
      onChange={({ target: { value } }) => onChange(toObject(value))}
      className={styles.group}
      defaultValue={toString(initialValue)}
    >
      <Loop facets={facets} />
    </Radio.Group>
  );
};

export default DiceSideSelector;
