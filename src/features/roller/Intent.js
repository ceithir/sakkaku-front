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

export default ({ completed, onFinish, values }) => {
  return (
    <Form {...layout} initialValues={values} onFinish={onFinish}>
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
