import React, { useState, useEffect } from "react";
import { Form, InputNumber, Typography, Switch, Divider } from "antd";
import styles from "./Calculator.module.less";
import worker from "workerize-loader!./worker"; // eslint-disable-line import/no-webpack-loader-syntax
import { LoadingOutlined } from "@ant-design/icons";

const { Paragraph, Text } = Typography;

let workerInstance;
let cache = {};
const keify = (mathParams) => JSON.stringify(mathParams);
const load = (params) => cache[keify(params)];
const save = (params, result) => {
  cache[keify(params)] = result;
};

const computeAndCacheCumulativeSuccess = async ({ mathParams, callback }) => {
  workerInstance.asyncCumulativeSuccess(mathParams);

  const intervalID = setInterval(() => {
    const result = load(mathParams);
    if (result) {
      clearInterval(intervalID);
      callback(result);
    }
  });
};

const TextOutput = ({
  ring,
  skill,
  tn,
  unskilled_assist,
  skilled_assist,
  compromised,
}) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState();

  useEffect(() => {
    if (workerInstance) {
      workerInstance.terminate();
    }
    workerInstance = worker();
    workerInstance.addEventListener("message", (message) => {
      const {
        data: { type, params, result },
      } = message;
      if (type === "custom") {
        const formattedResult = `${(Math.abs(result) * 100).toFixed(2)}%`;
        save(params, formattedResult);
      }
    });
  }, []);

  useEffect(() => {
    if (
      ![tn, ring, skill, skilled_assist, unskilled_assist].every(
        (n) => Number.isInteger(n) && n >= 0
      )
    ) {
      setLoading(true);
      return;
    }

    if (
      tn > 8 ||
      ring < 1 ||
      ring > 6 ||
      skill > 6 ||
      skilled_assist > 5 ||
      unskilled_assist > 5
    ) {
      setLoading(true);
      return;
    }

    const mathParams = {
      tn,
      ring: ring + unskilled_assist,
      skill: skill + skilled_assist,
      options: {
        compromised,
        keptDiceCount: ring + unskilled_assist + skilled_assist,
      },
    };

    const setFromCache = () => {
      const cachedResult = load(mathParams);
      if (!cachedResult) {
        return false;
      }

      setResult(cachedResult);
      setLoading(false);
      return true;
    };

    if (setFromCache()) {
      return;
    }

    setTimeout(() => {
      if (!setFromCache()) {
        setLoading(true);
      }
    }, 100);

    computeAndCacheCumulativeSuccess({
      mathParams,
      callback: setFromCache,
    });
  }, [ring, skill, tn, unskilled_assist, skilled_assist, compromised]);

  return (
    <StaticTextOutput
      loading={loading}
      result={result}
      compromised={compromised}
    />
  );
};

const StaticTextOutput = ({ result, loading, compromised }) => {
  return (
    <Paragraph>
      <Text>
        {compromised
          ? `Chances to achieve TN, without taking strife, ignoring rerolls and other modifiers: `
          : `Chances to achieve TN, taking as much strife as necessary, ignoring rerolls and other modifiers: `}
      </Text>
      <Text strong>{loading ? <LoadingOutlined /> : result}</Text>
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
