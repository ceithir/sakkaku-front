import React, { useState } from "react";
import { Form, InputNumber, Typography, Switch } from "antd";
import { cumulativeSuccess } from "./maths";
import styles from "./Calculator.module.less";

const { Paragraph, Text } = Typography;

const Calculator = () => {
  const [form] = Form.useForm();
  const initialValues = { ring: 3, skill: 1, tn: 3 };
  const [values, setValues] = useState(initialValues);
  const [compromised, setComprised] = useState(false);

  return (
    <Form
      layout={"inline"}
      form={form}
      initialValues={{ ...initialValues, compromised: false }}
      onValuesChange={(_, { ring, skill, tn, compromised }) => {
        setValues({ ring, skill, tn });
        setComprised(compromised);
      }}
      className={styles.form}
    >
      <Form.Item label="Ring" name="ring">
        <InputNumber min={1} max={10} />
      </Form.Item>
      <Form.Item label="Skill" name="skill">
        <InputNumber min={0} max={10} />
      </Form.Item>
      <Form.Item label="TN" name="tn">
        <InputNumber min={1} max={10} />
      </Form.Item>
      <Form.Item
        label={"Compromised?"}
        name="compromised"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <output>
        <Paragraph>
          <Text>
            {compromised
              ? `Chances to achieve TN, by taking no strife at all, ignoring rerolls, alterations and other modifiers: `
              : `Chances to achieve TN, by taking as much strife as necessary, ignoring rerolls, alterations and other modifiers: `}
          </Text>
          <Text strong>{`${(
            Math.abs(
              cumulativeSuccess({ ...values, options: { compromised } })
            ) * 100
          ).toFixed(2)}%`}</Text>
          <Text>{`.`}</Text>
        </Paragraph>
      </output>
    </Form>
  );
};

export default Calculator;
