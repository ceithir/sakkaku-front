import React from "react";
import Layout from "./Layout";
import styles from "./Roller.module.less";
import { Form, Button, InputNumber } from "antd";

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
  return (
    <Layout>
      <div className={styles.container}>
        <Form className={styles.form}>
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
            <Button type="primary" htmlType="submit">
              {`Roll`}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
};

export default Roller;
