import React from "react";
import { Form, Input, InputNumber, Button, Radio, Switch, Divider } from "antd";
import styles from "./Intent.module.css";

const { TextArea } = Input;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const defaultRules = [{ required: true, message: "Please fill this field" }];

const Intent = ({ onFinish, values, loading }) => {
  return (
    <Form
      className="boxed"
      {...layout}
      initialValues={values}
      onFinish={(data) => {
        onFinish({
          ...data,
          modifiers: [
            data["modifier"],
            data["compromised"] && "compromised",
            data["void"] && "void",
          ].filter(Boolean),
        });
      }}
    >
      <Form.Item label="Campaign" name="campaign" rules={defaultRules}>
        <Input />
      </Form.Item>
      <Form.Item label="Character" name="character" rules={defaultRules}>
        <Input />
      </Form.Item>
      <Form.Item label="TN" name="tn" rules={defaultRules}>
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item label="Description" name="description" rules={defaultRules}>
        <TextArea />
      </Form.Item>
      <Divider />
      <Form.Item label="Ring" name="ring" rules={defaultRules}>
        <InputNumber min={1} max={5} />
      </Form.Item>
      <Form.Item label="Skill" name="skill" rules={defaultRules}>
        <InputNumber min={0} max={5} />
      </Form.Item>
      <Divider />
      <Form.Item label="Void?" name="void" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="Advantage / Disadvantage" name="modifier">
        <Radio.Group>
          <Radio.Button value="">None</Radio.Button>
          <Radio.Button value="distinction">Distinction</Radio.Button>
          <Radio.Button value="adversity">Adversity</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="Compromised?"
        name="compromised"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Divider />
      <Form.Item {...tailLayout}>
        <Button
          type="primary"
          htmlType="submit"
          className={styles.submit}
          disabled={loading}
        >
          Roll
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Intent;
