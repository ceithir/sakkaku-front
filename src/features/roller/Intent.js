import React from "react";
import { Form, Input, InputNumber, Button } from "antd";
import styles from "./Intent.module.css";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const tailLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const initialValues = {
  tn: 1,
  ring: 1,
  skill: 1,
};

export default ({ completed, onFinish }) => {
  return (
    <Form {...layout} initialValues={initialValues} onFinish={onFinish}>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Roll description is required" }]}
      >
        <Input disabled={completed} />
      </Form.Item>
      <Form.Item label="TN" name="tn" rules={[{ required: true }]}>
        <InputNumber disabled={completed} />
      </Form.Item>
      <Form.Item label="Ring" name="ring" rules={[{ required: true }]}>
        <InputNumber disabled={completed} />
      </Form.Item>
      <Form.Item label="Skill" name="skill" rules={[{ required: true }]}>
        <InputNumber disabled={completed} />
      </Form.Item>
      {!completed && (
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" className={styles.submit}>
            Roll
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};
