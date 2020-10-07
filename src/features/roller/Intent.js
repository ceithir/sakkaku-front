import React from "react";
import { Form, Input, InputNumber, Button, Radio, Switch } from "antd";
import styles from "./Intent.module.css";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const tailLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const Intent = ({ completed, onFinish, values }) => {
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
        <InputNumber disabled={completed} min={1} />
      </Form.Item>
      <Form.Item label="Ring" name="ring" rules={[{ required: true }]}>
        <InputNumber disabled={completed} min={1} max={5} />
      </Form.Item>
      <Form.Item label="Skill" name="skill" rules={[{ required: true }]}>
        <InputNumber disabled={completed} min={0} max={5} />
      </Form.Item>
      <Form.Item label="Modifier" name="modifier">
        <Radio.Group disabled={completed}>
          <Radio.Button value="none">None</Radio.Button>
          <Radio.Button value="distinction">Distinction</Radio.Button>
          <Radio.Button value="adversity">Adversity</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="Compromised?"
        name="compromised"
        valuePropName="checked"
      >
        <Switch disabled={completed} />
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

export default Intent;
