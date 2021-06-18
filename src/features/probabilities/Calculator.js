import React, { useState } from "react";
import { Form, InputNumber, Typography, Switch, Divider } from "antd";
import { cumulativeSuccess } from "./maths";
import styles from "./Calculator.module.less";

const { Paragraph, Text } = Typography;

let cache = {};
const cumulativeSuccessWithCache = (params) => {
  const key = JSON.stringify(params);
  if (cache[key]) {
    return cache[key];
  }

  const result = cumulativeSuccess(params);
  cache[key] = result;
  return result;
};

const TextOutput = ({
  ring,
  skill,
  tn,
  unskilled_assist,
  skilled_assist,
  compromised,
}) => {
  const proba = cumulativeSuccessWithCache({
    tn,
    ring: ring + unskilled_assist,
    skill: skill + skilled_assist,
    options: {
      compromised,
      keptDiceCount: ring + unskilled_assist + skilled_assist,
    },
  });

  return (
    <Paragraph>
      <Text>
        {compromised
          ? `Chances to achieve TN, by taking no strife at all, ignoring rerolls, alterations and other modifiers: `
          : `Chances to achieve TN, by taking as much strife as necessary, ignoring rerolls, alterations and other modifiers: `}
      </Text>
      <Text strong>{`${(Math.abs(proba) * 100).toFixed(2)}%`}</Text>
      <Text>{`.`}</Text>
    </Paragraph>
  );
};

const Calculator = () => {
  const [form] = Form.useForm();
  const initialValues = {
    ring: 3,
    skill: 1,
    tn: 3,
    unskilled_assist: 0,
    skilled_assist: 0,
    compromised: false,
  };
  const [values, setValues] = useState(initialValues);

  return (
    <Form
      layout={"inline"}
      form={form}
      initialValues={initialValues}
      onValuesChange={(_, values) => {
        setValues(values);
      }}
      className={styles.form}
    >
      <Form.Item label="Ring" name="ring">
        <InputNumber min={1} max={6} />
      </Form.Item>
      <Form.Item label="Skill" name="skill">
        <InputNumber min={0} max={6} />
      </Form.Item>
      <Form.Item label="TN" name="tn">
        <InputNumber min={1} max={8} />
      </Form.Item>
      <Form.Item
        label={"Compromised?"}
        name="compromised"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Divider />
      <Form.Item label="Assistance (unskilled)" name="unskilled_assist">
        <InputNumber min={0} max={5} />
      </Form.Item>
      <Form.Item label="Assistance (skilled)" name="skilled_assist">
        <InputNumber min={0} max={5} />
      </Form.Item>
      <Divider />
      <output>
        <TextOutput {...values} />
      </output>
    </Form>
  );
};

export default Calculator;
