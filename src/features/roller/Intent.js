import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Radio,
  Switch,
  Divider,
  AutoComplete,
  Card,
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
import { setAnimatedStep } from "../roller/reducer";
import Animate from "rc-animate";
import { DECLARE } from "./Steps";

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

const AnimatedIntent = ({ onFinish, values }) => {
  const [completed, setCompleted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (completed) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [completed]);

  const onComplete = () => {
    setCompleted(true);
    dispatch(setAnimatedStep(DECLARE));
  };

  return (
    <Animate
      transitionName="fade"
      transitionEnter={false}
      transitionLeave={true}
      showProp="visible"
      onEnd={() => dispatch(setAnimatedStep(null))}
    >
      <div visible={!completed}>
        <Intent onComplete={onComplete} onFinish={onFinish} values={values} />
      </div>
    </Animate>
  );
};

const Intent = ({ onFinish, values, onComplete }) => {
  const campaigns = useSelector(selectCampaigns);
  const characters = useSelector(selectCharacters);
  const dispatch = useDispatch();

  const wrappedOnFinish = (data) => {
    onComplete();

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
    <Card>
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
    </Card>
  );
};

export default AnimatedIntent;
