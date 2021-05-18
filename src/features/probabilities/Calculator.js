import React, { useState } from "react";
import { Form, InputNumber, Typography } from "antd";
import { cumulativeSuccess } from "./maths";
import styles from "./Calculator.module.less";

const { Paragraph, Text } = Typography;

const Calculator = () => {
  const [form] = Form.useForm();
  const initialValues = { ring: 3, skill: 1, tn: 3 };
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
        <InputNumber min={1} max={10} />
      </Form.Item>
      <Form.Item label="Skill" name="skill">
        <InputNumber min={0} max={10} />
      </Form.Item>
      <Form.Item label="TN" name="tn">
        <InputNumber min={1} max={10} />
      </Form.Item>
      <output>
        <Paragraph>
          <Text>
            {`Chances to achieve TN, by taking as much strife as necessary, ignoring rerolls, alterations and other modifiers: `}
          </Text>
          <Text strong>{`${(cumulativeSuccess(values) * 100).toFixed(
            2
          )}%`}</Text>
          <Text>{`.`}</Text>
        </Paragraph>
      </output>
    </Form>
  );
};

export default Calculator;
