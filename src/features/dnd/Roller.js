import React, { useState, useEffect } from "react";
import { Form, Input, Typography, Button, InputNumber, Divider } from "antd";
import DefaultErrorMessage from "DefaultErrorMessage";
import Layout from "./Layout";
import styles from "./Roller.module.less";
import { parse } from "./formula";
import { postOnServer } from "server";

const { Paragraph, Text } = Typography;

const ResultPlaceholder = () => {
  return (
    <div className={styles.result}>
      <Text type="secondary">{`Pending…`}</Text>
    </div>
  );
};

const Result = ({ parameters, dice }) => {
  const keptDice = dice
    .filter(({ status }) => status === "kept")
    .map(({ value }) => value);
  const modifier = parameters.modifier;

  const total = keptDice.reduce((acc, value) => {
    return acc + value;
  }, modifier);

  return (
    <div className={styles.result}>
      <>
        {`${dice
          .filter(({ status }) => status === "kept")
          .map(({ value }) => value)
          .join("+")}`}
        {!!modifier && (
          <>
            {` `}
            <Text code={true}>
              {modifier > 0 ? `+${modifier}` : `${modifier}`}
            </Text>
          </>
        )}
        {` ⇒ `}
      </>
      <Text
        strong={true}
        type={
          parameters.tn
            ? total >= parameters.tn
              ? "success"
              : "danger"
            : undefined
        }
      >
        {total}
      </Text>
    </div>
  );
};

const Roller = () => {
  const [formula, setFormula] = useState();
  const [parsedFormula, setParsedFormula] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  useEffect(() => {
    if (!!result) {
      document.querySelector(":focus")?.blur();
    }
  }, [result]);

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <Layout>
      <div className={styles.container}>
        <Form
          onValuesChange={(_, { formula }) => {
            setFormula(formula);
            setParsedFormula(parse(formula));
            setResult(undefined);
          }}
          onFinish={({ formula, tn }) => {
            setLoading(true);
            setResult(undefined);

            const parameters = {
              ...parse(formula),
              tn,
            };
            const metadata = {
              original: formula,
            };

            const error = (_err) => {
              setError(true);
              setLoading(false);
            };

            postOnServer({
              uri: "/public/dnd/rolls/create",
              body: {
                parameters,
                metadata,
              },
              success: (data) => {
                setResult(data);
                setLoading(false);
              },
              error,
            });
          }}
          className={styles.form}
        >
          <Form.Item
            label={`Dice`}
            name="formula"
            rules={[
              { required: true, message: `Please enter what you wish to roll` },
            ]}
          >
            <Input placeholder={`2d6`} />
          </Form.Item>
          <Form.Item label={`Target number`} name="tn">
            <InputNumber />
          </Form.Item>
          {formula && !parsedFormula && (
            <Paragraph type="secondary">{`Incomplete or erroneous formula…`}</Paragraph>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!parsedFormula}
              loading={loading}
            >
              {`Roll`}
            </Button>
          </Form.Item>
        </Form>
        <Divider />
        {result && <Result {...result} />}
        {!result && <ResultPlaceholder />}
      </div>
    </Layout>
  );
};

export default Roller;
