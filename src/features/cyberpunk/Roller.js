import React, { useState } from "react";
import { Form, Input, Button, Divider } from "antd";
import DefaultErrorMessage from "DefaultErrorMessage";
import Layout from "./Layout";
import styles from "./Roller.module.less";
import { postOnServer } from "server";
import { pattern, parse } from "./formula";

const Result = ({ result }) => {
  if (!result) {
    return <div className={styles.result}>{`💮`}</div>;
  }

  const modifier = result.parameters.modifier;
  const textModifier =
    !!modifier && (modifier > 0 ? `+${modifier}` : `${modifier}`);
  const total = result.dice.reduce((prev, cur) => prev + cur, 0) + modifier;

  if (!modifier && result.dice.length === 1) {
    return (
      <div className={styles.result}>
        {`"1d10" ⇒ `}
        <strong>{total}</strong>
      </div>
    );
  }

  return (
    <div className={styles.result}>
      {`"1d10"`}
      {` ⇒ ${result.dice.join("+").replace("+-", "-")}`}
      {textModifier}
      {` ⇒ `}
      <strong>{total}</strong>
    </div>
  );
};

const Roller = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <Layout>
      <div className={styles.container}>
        <Form
          onFinish={({ formula }) => {
            setLoading(true);
            setResult(undefined);

            const parameters = {
              modifier: parse(formula) || 0,
            };
            const metadata = {
              original: formula,
            };

            const error = () => {
              setError(true);
              setLoading(false);
            };

            postOnServer({
              uri: "/public/cyberpunk/rolls/create",
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
          <div className={styles.formula}>
            <span>{`"1d10"`}</span>
            <span>{` + `}</span>
            <Form.Item
              name="formula"
              rules={[
                {
                  pattern,
                  message: `Unrecognized syntax`,
                },
              ]}
            >
              <Input placeholder={`2+5-3`} autoComplete="off" />
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {`Roll`}
            </Button>
          </Form.Item>
        </Form>
        <Divider />
        <Result result={result} />
      </div>
    </Layout>
  );
};

export default Roller;
