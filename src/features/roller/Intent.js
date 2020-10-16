import React from "react";
import {
  Form,
  Input,
  InputNumber,
  Radio,
  Switch,
  Divider,
  AutoComplete,
} from "antd";
import styles from "./Intent.module.css";
import NextButton from "./NextButton";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCampaigns,
  selectCharacters,
  addCampaign,
  addCharacter,
} from "../user/reducer";

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

const arrayToAutoCompleteOptions = (values) => {
  if (!values) {
    return undefined;
  }

  return values.map((value) => {
    return {
      value,
    };
  });
};

const Intent = ({ onFinish, values }) => {
  const campaigns = useSelector(selectCampaigns);
  const characters = useSelector(selectCharacters);
  const dispatch = useDispatch();

  const wrappedOnFinish = (data) => {
    dispatch(addCampaign(data["campaign"]));
    dispatch(addCharacter(data["character"]));

    onFinish({
      ...data,
      modifiers: [
        data["modifier"],
        data["compromised"] && "compromised",
        data["void"] && "void",
      ].filter(Boolean),
    });
  };

  return (
    <Form
      className={`boxed ${styles.form}`}
      {...layout}
      initialValues={values}
      onFinish={wrappedOnFinish}
    >
      <Form.Item label="Campaign" name="campaign" rules={defaultRules}>
        <AutoComplete options={arrayToAutoCompleteOptions(campaigns)} />
      </Form.Item>
      <Form.Item label="Character" name="character" rules={defaultRules}>
        <AutoComplete options={arrayToAutoCompleteOptions(characters)} />
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
        <NextButton htmlType="submit">Roll</NextButton>
      </Form.Item>
    </Form>
  );
};

export default Intent;
