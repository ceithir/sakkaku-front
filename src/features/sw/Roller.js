import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import styles from "./Roller.module.less";
import { Form, Button, InputNumber, Divider } from "antd";
import DefaultErrorMessage from "DefaultErrorMessage";
import { postOnServer } from "server";
import Result from "./Result";

const DiceNumber = ({ label, name, rules = [] }) => {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[
        {
          type: "integer",
          min: 0,
          max: 10,
          message: `Between 0 and 10 please.`,
        },
        ...rules,
      ]}
    >
      <InputNumber min="0" max="10" />
    </Form.Item>
  );
};

const Roller = () => {
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
          className={styles.form}
          onValuesChange={() => {
            setResult(undefined);
          }}
          onFinish={({
            boost,
            ability,
            proficiency,
            setback,
            difficulty,
            challenge,
            force,
          }) => {
            setLoading(true);
            setResult(undefined);

            const parameters = {
              boost,
              ability,
              proficiency,
              setback,
              difficulty,
              challenge,
              force,
            };
            const metadata = {};

            const error = (err) => {
              setError(true);
              setLoading(false);
            };

            postOnServer({
              uri: "/public/ffg/sw/rolls/create",
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
            return;
          }}
        >
          <div className={styles.line}>
            <DiceNumber label={`Boost`} name="boost" />
            <DiceNumber label={`Ability`} name="ability" />
            <DiceNumber label={`Proficiency`} name="proficiency" />
          </div>
          <div className={styles.line}>
            <DiceNumber label={`Setback`} name="setback" />
            <DiceNumber label={`Difficulty`} name="difficulty" />
            <DiceNumber label={`Challenge`} name="challenge" />
          </div>
          <div className={styles.center}>
            <DiceNumber
              label={`Force`}
              name="force"
              rules={[
                ({ getFieldValue }) => ({
                  validator: () => {
                    if (
                      !!getFieldValue("boost") ||
                      !!getFieldValue("ability") ||
                      !!getFieldValue("proficiency") ||
                      !!getFieldValue("setback") ||
                      !!getFieldValue("difficulty") ||
                      !!getFieldValue("challenge") ||
                      !!getFieldValue("force")
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(`Must roll at least one die.`)
                    );
                  },
                }),
              ]}
            />
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {`Roll`}
            </Button>
          </Form.Item>
        </Form>
        {!!result && (
          <>
            <Divider />
            <Result {...result} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Roller;
